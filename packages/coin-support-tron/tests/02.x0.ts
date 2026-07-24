import { Observer } from 'rxjs';
import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { decompressPublicKey } from '@cypherock/coin-support-utils';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { getAddressFromPublicKey } from '@cypherock/sdk-app-tron';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha2';

import * as serviceMock from './__mocks__/services';
import {
  createMockX0Session,
  getMockPublicKey,
  MOCK_WALLET_ID,
} from './__mocks__/x0Session';

import { TronSupport } from '../src';

// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
const TronWebLib = require('tronweb');

const TronWebCtor = TronWebLib.TronWeb ?? TronWebLib.default ?? TronWebLib;

const TRONLINK_PATH_0 = [0x8000002c, 0x800000c3, 0x80000000, 0, 0];

const makeAccount = (): IAccount => ({
  name: 'Tron 1',
  xpubOrAddress: getAddressFromPublicKey(
    decompressPublicKey(getMockPublicKey(TRONLINK_PATH_0)),
  ),
  balance: '0',
  unit: 'TRX',
  derivationPath: "m/44'/195'/0'/0/0",
  type: 'account' as any,
  familyId: 'tron',
  assetId: 'tron',
  parentAssetId: 'tron',
  walletId: MOCK_WALLET_ID,
  derivationScheme: 'tronlink',
  isHidden: false,
  extraData: {},
});

describe('02. X0 flows', () => {
  let support: TronSupport;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);
  const getOneMock = jest.fn();

  beforeEach(() => {
    TronSupport.setTronWeb(
      new TronWebCtor({ fullHost: 'https://api.trongrid.io' }),
    );
    support = new TronSupport();
    db = {
      account: {
        getAll: getAllMock,
        getOne: getOneMock,
      },
    } as any;

    serviceMock.getBalanceAndTransactionsCount.mockClear();
    getAllMock.mockClear();
    getAllMock.mockReturnValue([]);
    getOneMock.mockReset();
  });

  test('createAccounts derives addresses on the card and skips the atomic scheme', done => {
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
        expect(accounts.length).toEqual(1);
        expect(accounts[0].derivationScheme).toEqual('tronlink');
        expect(accounts[0].derivationPath).toEqual("m/44'/195'/0'/0/0");
        expect(accounts[0].xpubOrAddress).toEqual(makeAccount().xpubOrAddress);
        expect(accounts[0].xpubOrAddress.startsWith('T')).toEqual(true);
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
        coinId: 'tron',
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  }, 10000);

  test('signTransaction signs sha256(raw_data) with a recoverable signature', done => {
    const account = makeAccount();
    const rawDataHex = '0a02deadbeef2208c0ffee0000000000';
    const transaction: any = {
      accountId: 'account-1',
      validation: {},
      userInputs: { outputs: [], isSendAll: false },
      staticData: {},
      computedData: {
        unsignedTransaction: {
          txID: 'stale-tx-id',
          raw_data: {},
          raw_data_hex: rawDataHex,
        },
        fee: '0',
      },
    };

    let signed: any;

    const observer: Observer<any> = {
      next: data => {
        if (data.type === 'Transaction') signed = data.transaction;
      },
      complete: () => {
        expect(signed).toBeDefined();
        expect(signed.raw_data_hex).toEqual(rawDataHex);
        expect(signed.signature).toHaveLength(1);

        const signatureHex: string = signed.signature[0];
        expect(signatureHex).toHaveLength(130);

        const digest = sha256(Uint8Array.from(Buffer.from(rawDataHex, 'hex')));
        const recovery = parseInt(signatureHex.slice(128), 16) - 27;
        const recovered = secp256k1.Signature.fromCompact(
          signatureHex.slice(0, 128),
        )
          .addRecoveryBit(recovery)
          .recoverPublicKey(digest)
          .toRawBytes(true);

        expect(Buffer.from(recovered).toString('hex')).toEqual(
          Buffer.from(getMockPublicKey(TRONLINK_PATH_0)).toString('hex'),
        );
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
  }, 10000);

  test('receive verifies the address against the card', done => {
    const account = makeAccount();
    getOneMock.mockReturnValue(Promise.resolve(account));

    let didAddressMatched: boolean | undefined;

    const observer: Observer<IReceiveEvent> = {
      next: data => {
        if (data.type === 'AddressMatched') {
          didAddressMatched = data.didAddressMatched;
        }
      },
      complete: () => {
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
  }, 10000);
});
