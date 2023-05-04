import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as evmAppMock from './__mocks__/evmApp';
import * as serviceMock from './__mocks__/services';
import { EvmSupport } from '../src';

describe('02. Create Account', () => {
  let support: EvmSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    support = new EvmSupport();
    connection = {} as any;
    db = {
      account: {
        getAll: getAllMock,
      },
    } as any;

    evmAppMock.create.mockClear();
    evmAppMock.getPublicKeys.mockClear();

    serviceMock.getBalance.mockClear();
    serviceMock.getTransactionCount.mockClear();

    getAllMock.mockClear();
  });

  test('should be able to create new accounts', async () => {
    const accounts = await support.createAccounts({
      connection,
      db,
      coinId: 'ethereum',
      walletId: '1243',
      waitInMSBetweenEachAccountAPI: 1,
    });

    expect(accounts).toBeDefined();
    expect(accounts.length).toEqual(6);
    const ledgerAccounts = accounts.filter(
      e => e.extraData.derivationScheme === 'ledger',
    );
    const metaMaskAccounts = accounts.filter(
      e => e.extraData.derivationScheme === 'metamask',
    );
    const legacyAccounts = accounts.filter(
      e => e.extraData.derivationScheme === 'legacy',
    );

    expect(ledgerAccounts.length).toEqual(2);
    expect(ledgerAccounts.map(e => e.derivationPath)).toEqual([
      "m/44'/60'/0'/0/0",
      "m/44'/60'/1'/0/0",
    ]);

    expect(metaMaskAccounts.length).toEqual(2);
    expect(metaMaskAccounts.map(e => e.derivationPath)).toEqual([
      "m/44'/60'/0'/0/1",
      "m/44'/60'/0'/0/2",
    ]);

    expect(legacyAccounts.length).toEqual(2);
    expect(legacyAccounts.map(e => e.derivationPath)).toEqual([
      "m/44'/60'/0'/0",
      "m/44'/60'/0'/1",
    ]);
  });

  test('should be able to skip existing accounts', async () => {
    getAllMock.mockReturnValue([
      { derivationPath: "m/44'/60'/0'/0/0" },
      { derivationPath: "m/44'/60'/0'/0/1" },
      { derivationPath: "m/44'/60'/0'/0" },
    ]);

    const accounts = await support.createAccounts({
      connection,
      db,
      coinId: 'ethereum',
      walletId: '1243',
      waitInMSBetweenEachAccountAPI: 1,
    });

    expect(accounts).toBeDefined();
    expect(accounts.length).toEqual(6);
    const ledgerAccounts = accounts.filter(
      e => e.extraData.derivationScheme === 'ledger',
    );
    const metaMaskAccounts = accounts.filter(
      e => e.extraData.derivationScheme === 'metamask',
    );
    const legacyAccounts = accounts.filter(
      e => e.extraData.derivationScheme === 'legacy',
    );

    expect(ledgerAccounts.length).toEqual(2);
    expect(ledgerAccounts.map(e => e.derivationPath)).toEqual([
      "m/44'/60'/1'/0/0",
      "m/44'/60'/2'/0/0",
    ]);

    expect(metaMaskAccounts.length).toEqual(2);
    expect(metaMaskAccounts.map(e => e.derivationPath)).toEqual([
      "m/44'/60'/0'/0/2",
      "m/44'/60'/0'/0/3",
    ]);

    expect(legacyAccounts.length).toEqual(2);
    expect(legacyAccounts.map(e => e.derivationPath)).toEqual([
      "m/44'/60'/0'/1",
      "m/44'/60'/0'/2",
    ]);
  });
});
