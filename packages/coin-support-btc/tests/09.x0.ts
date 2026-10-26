import {
  IReceiveEvent,
  IX0Session,
  X0SignatureScheme,
} from '@cypherock/coin-support-interfaces';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { HDKey } from '@scure/bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Observer } from 'rxjs';

import * as serviceMock from './__mocks__/services';
import {
  createMockX0Session,
  getMockPublicKey,
  IMockX0SessionOptions,
  MOCK_WALLET_ID,
} from './__mocks__/x0Session';

import { BtcSupport } from '../src';

const H = 0x80000000;
const NATIVE_SEGWIT_PATH = [84 + H, 0 + H, 0 + H];
const TAPROOT_PATH = [86 + H, 0 + H, 0 + H];

const XPUB = 0x0488b21e;
const YPUB = 0x049d7cb2;
const ZPUB = 0x04b24746;
const LTUB = 0x019da462;

const MASTER_SEED = Uint8Array.from(
  Buffer.from(
    '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
    'hex',
  ),
);

/** Account xpub encoded under `version`, independent of the code under test. */
const accountXpub = (path: number[], version: number): string => {
  let node = HDKey.fromMasterSeed(MASTER_SEED, {
    public: version,
    private: 0x0488ade4,
  });
  for (const index of path) node = node.deriveChild(index);
  return node.publicExtendedKey;
};

const p2wpkhAddress = (leaf: number[]): string => {
  const pubkey = getMockPublicKey([...NATIVE_SEGWIT_PATH, ...leaf]);
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(pubkey),
    network: bitcoin.networks.bitcoin,
  });
  if (!address) throw new Error('Failed to derive test address');
  return address;
};

const p2trAddress = (leaf: number[]): string => {
  const pubkey = getMockPublicKey([...TAPROOT_PATH, ...leaf]);
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: Buffer.from(pubkey.slice(1, 33)),
    network: bitcoin.networks.bitcoin,
  });
  if (!address) throw new Error('Failed to derive test address');
  return address;
};

const makeAccount = (overrides: Partial<IAccount> = {}): IAccount => ({
  name: 'Bitcoin 1',
  xpubOrAddress: accountXpub(NATIVE_SEGWIT_PATH, ZPUB),
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
  ...overrides,
});

const makeTaprootAccount = (): IAccount =>
  makeAccount({
    xpubOrAddress: `tr(${accountXpub(TAPROOT_PATH, ZPUB)})`,
    derivationPath: "m/86'/0'/0'",
    derivationScheme: 'taproot',
  });

const makeTransaction = (
  inputLeaves: number[][],
  toAddress: (leaf: number[]) => string,
  purpose: number,
): any => ({
  accountId: 'account-1',
  validation: {},
  userInputs: { outputs: [], feeRate: 10, isSendAll: false },
  staticData: { averageFee: 10, utxos: [] },
  computedData: {
    fee: 5000,
    inputs: inputLeaves.map((leaf, i) => ({
      address: toAddress(leaf),
      block_height: 100,
      confirmations: 10,
      txId: `${'ab'.repeat(31)}${i.toString(16).padStart(2, '0')}`,
      value: 60000,
      vout: i,
      derivationPath: `m/${purpose}'/0'/0'/${leaf[0]}/${leaf[1]}`,
    })),
    outputs: [
      { address: p2wpkhAddress([0, 5]), value: 20000 },
      {
        address: toAddress([1, 0]),
        value: inputLeaves.length * 60000 - 25000,
        derivationPath: `m/${purpose}'/0'/0'/1/0`,
      },
    ],
  },
});

type SignCall = { path: number[]; count: number; scheme?: X0SignatureScheme };

const createRecordingX0Session = (
  calls: SignCall[],
  options?: IMockX0SessionOptions,
): IX0Session => {
  const session = createMockX0Session(MOCK_WALLET_ID, options);
  return {
    ...session,
    runTap: (op, hooks) =>
      session.runTap(
        card =>
          op({
            ...card,
            signHashes: params => {
              calls.push({
                path: params.path,
                count: params.hashes.length,
                scheme: params.scheme,
              });
              return card.signHashes(params);
            },
          }),
        hooks,
      ),
  };
};

const signWithX0 = (
  support: BtcSupport,
  db: IDatabase,
  x0: IX0Session,
  account: IAccount,
  transaction: any,
) =>
  new Promise<string>((resolve, reject) => {
    let signed: string | undefined;
    support.signTransaction({ x0, db, transaction, account }).subscribe({
      next: (data: any) => {
        if (data.type === 'Transaction') signed = data.transaction;
      },
      complete: () =>
        signed ? resolve(signed) : reject(new Error('No transaction')),
      error: reject,
    });
  });

const createAccountsWithX0 = (
  support: BtcSupport,
  db: IDatabase,
  coinId: string,
) =>
  new Promise<any[]>((resolve, reject) => {
    const accounts: any[] = [];
    let isDeviceDone = false;
    support
      .createAccounts({
        x0: createMockX0Session(),
        db,
        coinId,
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe({
        next: (data: any) => {
          if (data.type === 'Account' && data.account) {
            accounts.push(data.account);
          }
          if (data.type === 'Device' && data.device?.isDone) {
            isDeviceDone = true;
          }
        },
        complete: () =>
          isDeviceDone
            ? resolve(accounts)
            : reject(new Error('Device flow never finished')),
        error: reject,
      });
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

  test('createAccounts stores bitcoin xpubs in the X1 account format', async () => {
    const accounts = await createAccountsWithX0(support, db, 'bitcoin');
    const byScheme = (scheme: string) =>
      accounts.find(a => a.derivationScheme === scheme);

    expect(byScheme('taproot')).toMatchObject({
      derivationPath: "m/86'/0'/0'",
      xpubOrAddress: `tr(${accountXpub(TAPROOT_PATH, ZPUB)})`,
    });
    expect(byScheme('nativeSegwit')).toMatchObject({
      derivationPath: "m/84'/0'/0'",
      xpubOrAddress: accountXpub(NATIVE_SEGWIT_PATH, ZPUB),
    });
    expect(byScheme('segwit')).toMatchObject({
      derivationPath: "m/49'/0'/0'",
      xpubOrAddress: accountXpub([49 + H, 0 + H, 0 + H], YPUB),
    });
    expect(byScheme('legacy')).toMatchObject({
      derivationPath: "m/44'/0'/0'",
      xpubOrAddress: accountXpub([44 + H, 0 + H, 0 + H], XPUB),
    });
  }, 15000);

  test('createAccounts stores litecoin xpubs in the X1 account format', async () => {
    const accounts = await createAccountsWithX0(support, db, 'litecoin');

    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatchObject({
      derivationScheme: 'legacy',
      derivationPath: "m/44'/2'/0'",
      xpubOrAddress: accountXpub([44 + H, 2 + H, 0 + H], LTUB),
    });
  }, 15000);

  test.each([
    ['X1 zpub', ZPUB],
    ['pre-fix xpub', XPUB],
  ])(
    'signTransaction produces a valid native-segwit transaction (%s account)',
    async (_label, version) => {
      const inputLeaves = [
        [0, 0],
        [0, 1],
      ];
      const signed = await signWithX0(
        support,
        db,
        createMockX0Session(),
        makeAccount({
          xpubOrAddress: accountXpub(NATIVE_SEGWIT_PATH, version),
        }),
        makeTransaction(inputLeaves, p2wpkhAddress, 84),
      );

      const parsed = bitcoin.Transaction.fromHex(signed);
      expect(parsed.ins).toHaveLength(2);
      expect(parsed.outs).toHaveLength(2);

      parsed.ins.forEach((input, i) => {
        const [witnessSig, witnessPubkey] = input.witness;
        const pubkey = getMockPublicKey([
          ...NATIVE_SEGWIT_PATH,
          ...inputLeaves[i],
        ]);
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
    },
    15000,
  );

  test('signTransaction produces a valid taproot key-path transaction', async () => {
    // Four inputs on one leaf exceed the card's Schnorr batch of three.
    const inputLeaves = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 1],
    ];
    const calls: SignCall[] = [];
    const signed = await signWithX0(
      support,
      db,
      createRecordingX0Session(calls),
      makeTaprootAccount(),
      makeTransaction(inputLeaves, p2trAddress, 86),
    );

    expect(calls.map(c => [c.path[4], c.count, c.scheme])).toEqual([
      [0, 3, 'schnorr-bip340'],
      [0, 1, 'schnorr-bip340'],
      [1, 1, 'schnorr-bip340'],
    ]);

    const parsed = bitcoin.Transaction.fromHex(signed);
    expect(parsed.ins).toHaveLength(inputLeaves.length);

    const prevScripts = inputLeaves.map(leaf =>
      bitcoin.address.toOutputScript(
        p2trAddress(leaf),
        bitcoin.networks.bitcoin,
      ),
    );
    const values = inputLeaves.map(() => 60000);

    parsed.ins.forEach((input, i) => {
      // SIGHASH_DEFAULT key-path spend: a bare 64-byte signature
      expect(input.witness).toHaveLength(1);
      expect(input.witness[0]).toHaveLength(64);

      const sighash = parsed.hashForWitnessV1(
        i,
        prevScripts,
        values,
        bitcoin.Transaction.SIGHASH_DEFAULT,
      );
      const outputKey = prevScripts[i].subarray(2, 34);
      expect(
        schnorr.verify(
          Uint8Array.from(input.witness[0]),
          Uint8Array.from(sighash),
          Uint8Array.from(outputKey),
        ),
      ).toEqual(true);
    });
  }, 15000);

  test('signTransaction rejects taproot signatures made without the tweak', async () => {
    await expect(
      signWithX0(
        support,
        db,
        createMockX0Session(MOCK_WALLET_ID, { skipTaprootTweak: true }),
        makeTaprootAccount(),
        makeTransaction([[0, 0]], p2trAddress, 86),
      ),
    ).rejects.toThrow('X0 signature verification failed');
  }, 15000);

  const receiveCases: [
    string,
    () => IAccount,
    (leaf: number[]) => string,
    number,
  ][] = [
    ['native segwit', () => makeAccount(), p2wpkhAddress, 84],
    ['taproot', makeTaprootAccount, p2trAddress, 86],
  ];

  test.each(receiveCases)(
    'receive verifies the first unused %s address against the card',
    (_label, accountFactory, toAddress, purpose) =>
      new Promise<void>((resolve, reject) => {
        getOneMock.mockReturnValue(Promise.resolve(accountFactory()));
        serviceMock.getFirstUnusedAddress.mockReturnValueOnce(
          Promise.resolve({
            address: toAddress([0, 2]),
            derivationPath: `m/${purpose}'/0'/0'/0/2`,
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
            try {
              expect(address).toEqual(toAddress([0, 2]));
              expect(didAddressMatched).toEqual(true);
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          error: reject,
        };

        support
          .receive({
            x0: createMockX0Session(),
            db,
            accountId: 'account-1',
          })
          .subscribe(observer);
      }),
    15000,
  );
});
