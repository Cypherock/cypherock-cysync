import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { secp256k1 } from '@noble/curves/secp256k1';
import { HDKey } from '@scure/bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Observer } from 'rxjs';

import * as serviceMock from './__mocks__/services';
import {
  createMockX0Session,
  getMockPublicKey,
  MOCK_WALLET_ID,
} from './__mocks__/x0Session';

import { BtcSupport } from '../src';

const H = 0x80000000;
const ACCOUNT_PATH = [84 + H, 0 + H, 0 + H];

const MASTER_SEED_HEX =
  '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f';

const accountXpub = (): string => {
  let node = HDKey.fromMasterSeed(
    Uint8Array.from(Buffer.from(MASTER_SEED_HEX, 'hex')),
  );
  for (const index of ACCOUNT_PATH) node = node.deriveChild(index);
  return node.publicExtendedKey;
};

const p2wpkhAddress = (leaf: number[]): string => {
  const pubkey = getMockPublicKey([...ACCOUNT_PATH, ...leaf]);
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(pubkey),
    network: bitcoin.networks.bitcoin,
  });
  if (!address) throw new Error('Failed to derive test address');
  return address;
};

const makeAccount = (): IAccount => ({
  name: 'Bitcoin 1',
  xpubOrAddress: accountXpub(),
  balance: '0',
  unit: 'BTC',
  derivationPath: "m/84'/0'/0'",
  type: 'account' as any,
  familyId: 'bitcoin',
  assetId: 'bitcoin',
  parentAssetId: 'bitcoin',
  walletId: MOCK_WALLET_ID,
  derivationScheme: 'nativeSegwit',
  isHidden: false,
  extraData: {},
});

describe('09. X0 flows', () => {
  let support: BtcSupport;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);
  const getOneMock = jest.fn();

  beforeEach(() => {
    BtcSupport.setBitcoinLibrary(bitcoin);
    support = new BtcSupport();
    db = {
      account: {
        getAll: getAllMock,
        getOne: getOneMock,
      },
    } as any;

    serviceMock.getXpubDetails.mockClear();
    getAllMock.mockClear();
    getAllMock.mockReturnValue([]);
    getOneMock.mockReset();
  });

  test('createAccounts derives xpubs on the card and skips the taproot scheme', done => {
    const accounts: any[] = [];
    let isDeviceDone = false;

    const observer: Observer<any> = {
      next: data => {
        if (data.type === 'Account' && data.account) {
          accounts.push(data.account);
        }
        if (data.type === 'Device' && data.device?.isDone) {
          isDeviceDone = true;
        }
      },
      complete: () => {
        expect(isDeviceDone).toEqual(true);

        const schemes = accounts.map(a => a.derivationScheme);
        expect(schemes).not.toContain('taproot');
        expect(schemes).toContain('nativeSegwit');
        expect(schemes).toContain('segwit');
        expect(schemes).toContain('legacy');

        const nativeSegwit = accounts.find(
          a => a.derivationScheme === 'nativeSegwit',
        );
        expect(nativeSegwit.derivationPath).toEqual("m/84'/0'/0'");
        expect(nativeSegwit.xpubOrAddress).toEqual(accountXpub());
        done();
      },
      error: err => {
        done(err);
      },
    };

    support
      .createAccounts({
        x0: createMockX0Session(),
        db,
        coinId: 'bitcoin',
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  }, 15000);

  test('signTransaction produces a valid native-segwit transaction', done => {
    const account = makeAccount();
    const inputLeaves = [
      [0, 0],
      [0, 1],
    ];
    const transaction: any = {
      accountId: 'account-1',
      validation: {},
      userInputs: { outputs: [], feeRate: 10, isSendAll: false },
      staticData: { averageFee: 10, utxos: [] },
      computedData: {
        fee: 5000,
        inputs: inputLeaves.map((leaf, i) => ({
          address: p2wpkhAddress(leaf),
          block_height: 100,
          confirmations: 10,
          txId: `${'ab'.repeat(31)}${i.toString(16).padStart(2, '0')}`,
          value: 60000,
          vout: i,
          derivationPath: `m/84'/0'/0'/${leaf[0]}/${leaf[1]}`,
        })),
        outputs: [
          { address: p2wpkhAddress([0, 5]), value: 100000 },
          {
            address: p2wpkhAddress([1, 0]),
            value: 15000,
            derivationPath: "m/84'/0'/0'/1/0",
          },
        ],
      },
    };

    let signed: string | undefined;

    const observer: Observer<any> = {
      next: data => {
        if (data.type === 'Transaction') signed = data.transaction;
      },
      complete: () => {
        expect(signed).toBeDefined();

        const parsed = bitcoin.Transaction.fromHex(signed as string);
        expect(parsed.ins).toHaveLength(2);
        expect(parsed.outs).toHaveLength(2);

        parsed.ins.forEach((input, i) => {
          const [witnessSig, witnessPubkey] = input.witness;
          const pubkey = getMockPublicKey([...ACCOUNT_PATH, ...inputLeaves[i]]);
          expect(Buffer.from(witnessPubkey).toString('hex')).toEqual(
            Buffer.from(pubkey).toString('hex'),
          );

          // BIP143 sighash with the p2pkh script code of the pubkey
          const scriptCode = bitcoin.payments.p2pkh({
            pubkey: Buffer.from(pubkey),
            network: bitcoin.networks.bitcoin,
          }).output as Buffer;
          const sighash = parsed.hashForWitnessV0(
            i,
            scriptCode,
            60000,
            bitcoin.Transaction.SIGHASH_ALL,
          );

          expect(witnessSig[witnessSig.length - 1]).toEqual(
            bitcoin.Transaction.SIGHASH_ALL,
          );
          const der = witnessSig.subarray(0, witnessSig.length - 1);
          expect(
            secp256k1.verify(
              secp256k1.Signature.fromDER(der),
              Uint8Array.from(sighash),
              pubkey,
            ),
          ).toEqual(true);
        });
        done();
      },
      error: err => {
        done(err);
      },
    };

    support
      .signTransaction({
        x0: createMockX0Session(),
        db,
        transaction,
        account,
      })
      .subscribe(observer);
  }, 15000);

  test('receive verifies the first unused address against the card', done => {
    const account = makeAccount();
    getOneMock.mockReturnValue(Promise.resolve(account));
    serviceMock.getFirstUnusedAddress.mockReturnValueOnce(
      Promise.resolve({
        address: p2wpkhAddress([0, 2]),
        derivationPath: "m/84'/0'/0'/0/2",
      }),
    );

    let didAddressMatched: boolean | undefined;
    let address: string | undefined;

    const observer: Observer<IReceiveEvent> = {
      next: data => {
        if (data.type === 'Address') address = data.address;
        if (data.type === 'AddressMatched') {
          didAddressMatched = data.didAddressMatched;
        }
      },
      complete: () => {
        expect(address).toEqual(p2wpkhAddress([0, 2]));
        expect(didAddressMatched).toEqual(true);
        done();
      },
      error: err => {
        done(err);
      },
    };

    support
      .receive({
        x0: createMockX0Session(),
        db,
        accountId: 'account-1',
      })
      .subscribe(observer);
  }, 15000);
});
