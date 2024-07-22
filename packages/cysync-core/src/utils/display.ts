import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { IAccount } from '@cypherock/db-interfaces';

export const getBalanceToDisplay = (account: IAccount) => {
  const { amount, unit } = getParsedAmount({
    coinId: account.parentAssetId,
    assetId: account.assetId,
    unitAbbr:
      account.unit ??
      getDefaultUnit(account.parentAssetId, account.assetId).abbr,
    amount: account.balance,
  });
  return `${amount} ${unit.abbr}`;
};

export const truncateMiddle = (
  value: string,
  maxLen = 38,
  delimiter = '.......',
) => {
  const { length } = value;
  if (length < maxLen) return value;

  const shownLength = Math.floor((maxLen - delimiter.length) / 2);

  return (
    value.substring(0, shownLength) +
    delimiter +
    value.substring(length - shownLength, length)
  );
};
