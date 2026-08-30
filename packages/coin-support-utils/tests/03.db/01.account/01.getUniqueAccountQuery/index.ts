import { describe, test } from '@jest/globals';
import { accounts } from '../../../__fixtures__';
import { getUniqueAccountQuery } from '../../../../src';

describe('getUniqueAccountQuery', () => {
  test('should return a query object with the unique fields of the account', () => {
    accounts.forEach(account => {
      const accountQuery = getUniqueAccountQuery(account);
      expect(accountQuery).toBeTruthy();
      expect(accountQuery.walletId).toBe(account.walletId);
      expect(accountQuery.assetId).toBe(account.assetId);
      expect(accountQuery.familyId).toBe(account.familyId);
      expect(accountQuery.parentAccountId).toBe(account.parentAccountId);
      expect(accountQuery.parentAssetId).toBe(account.parentAssetId);
      expect(accountQuery.type).toBe(account.type);
      expect(accountQuery.derivationPath).toBe(account.derivationPath);
      expect(accountQuery.derivationScheme).toBe(account.derivationScheme);
    });
  });
});
