import { Observer } from 'rxjs';
import { IReceiveEvent, IX0Session } from '@cypherock/coin-support-interfaces';
import { sha512Half, verifyDerSignature } from '@cypherock/coin-support-utils';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as xrpl from 'xrpl';

import * as serviceMock from './__mocks__/services';
import {
  createMockX0Session,
  getMockPublicKey,
  MOCK_WALLET_ID,
} from './__mocks__/x0Session';

import { XrpSupport } from '../src';
import { X0_DERIVATION_PATH_LIMIT } from '../src/operations/createAccounts/x0';

const createPathCountingX0Session = (derivedPaths: number[][]): IX0Session => {
  const session = createMockX0Session();
  return {
    ...session,
    runTap: (op, hooks) =>
      session.runTap(
        card =>
          op({
            ...card,
            deriveKeys: params => {
              derivedPaths.push(...params.paths);
              return card.deriveKeys(params);
            },
          }),
        hooks,
      ),
  };
};

const DEFAULT_PATH_0 = [0x8000002c, 0x80000090, 0x80000000, 0, 0];
const DEFAULT_PATH_1 = [0x8000002c, 0x80000090, 0x80000000, 0, 1];

const pubkeyHex = (path: number[]): string =>
  Buffer.from(getMockPublicKey(path)).toString('hex');

const makeAccount = (): IAccount => ({
  name: 'XRP 1',
  xpubOrAddress: pubkeyHex(DEFAULT_PATH_0),
  balance: '0',
  unit: 'XRP',
  derivationPath: "m/44'/144'/0'/0/0",
  type: 'account' as any,
  familyId: 'xrp',
  assetId: 'xrp',
  parentAssetId: 'xrp',
  walletId: MOCK_WALLET_ID,
  derivationScheme: 'default',
  isHidden: false,
  extraData: {},
});

describe('02. X0 flows', () => {
  let support: XrpSupport;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);
  const getOneMock = jest.fn();

  beforeEach(() => {
    XrpSupport.setXrpLib(xrpl);
    support = new XrpSupport();
    db = {
      account: {
        getAll: getAllMock,
        getOne: getOneMock,
      },
    } as any;

    getAllMock.mockClear();
    getAllMock.mockReturnValue([]);
    getOneMock.mockReset();
    serviceMock.getBalance.mockClear();
  });

  test('createAccounts stores card-derived public keys', done => {
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
        expect(accounts[0].derivationPath).toEqual("m/44'/144'/0'/0/0");
        expect(accounts[0].xpubOrAddress).toEqual(pubkeyHex(DEFAULT_PATH_0));
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
        coinId: 'xrp',
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  }, 10000);

  test('createAccounts caps card derivations in one tap at the X0 path limit', done => {
    const derivedPaths: number[][] = [];

    support
      .createAccounts({
        x0: createPathCountingX0Session(derivedPaths),
        db,
        coinId: 'xrp',
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe({
        next: () => undefined,
        complete: () => {
          // single default scheme, X0_DERIVATION_PATH_LIMIT paths
          expect(derivedPaths).toHaveLength(X0_DERIVATION_PATH_LIMIT);
          done();
        },
        error: err => {
          done(err);
        },
      });
  }, 10000);

  test('signTransaction embeds a valid DER signature into the tx blob', done => {
    const account = makeAccount();
    const destination = xrpl.deriveAddress(pubkeyHex(DEFAULT_PATH_1));
    const transaction: any = {
      accountId: 'account-1',
      validation: {},
      userInputs: { outputs: [], isSendAll: false },
      staticData: {},
      computedData: {
        output: { address: destination, amount: '1000000' },
        fees: '12',
      },
    };

    let signed: string | undefined;

    const observer: Observer<any> = {
      next: data => {
        if (data.type === 'Transaction') signed = data.transaction;
      },
      complete: () => {
        expect(signed).toBeDefined();

        const decoded: any = xrpl.decode(signed as string);
        expect(decoded.TxnSignature).toBeDefined();
        expect(decoded.Account).toEqual(
          xrpl.deriveAddress(account.xpubOrAddress),
        );
        expect(decoded.Destination).toEqual(destination);

        const { TxnSignature, ...unsigned } = decoded;
        const digest = sha512Half(
          Uint8Array.from(Buffer.from(xrpl.encodeForSigning(unsigned), 'hex')),
        );
        expect(
          verifyDerSignature(
            digest,
            Uint8Array.from(Buffer.from(TxnSignature, 'hex')),
            getMockPublicKey(DEFAULT_PATH_0),
          ),
        ).toEqual(true);
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
    let address: string | undefined;

    const observer: Observer<IReceiveEvent> = {
      next: data => {
        if (data.type === 'Address') address = data.address;
        if (data.type === 'AddressMatched') {
          didAddressMatched = data.didAddressMatched;
        }
      },
      complete: () => {
        expect(address).toEqual(xrpl.deriveAddress(account.xpubOrAddress));
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
