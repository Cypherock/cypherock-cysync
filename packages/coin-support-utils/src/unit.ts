import { coinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';

export const getUnit = (coinId: string, unitName: string) => {
  const unit = coinList[coinId].units.find(
    u => u.abbr.toLowerCase() === unitName.toLowerCase(),
  );

  return unit;
};

export const getParsedAmount = (params: {
  coinId: string;
  unitName: string;
  amount: string;
}) => {
  const { coinId, unitName, amount } = params;
  const unit = getUnit(coinId, unitName);

  if (!unit) {
    throw new Error(`Invalid unit found: ${unitName} for coin ${coinId}`);
  }

  let num = new BigNumber(amount);

  if (unit.magnitude > 0) {
    num = num.dividedBy(new BigNumber(10).pow(unit.magnitude));
  }

  return { amount: num.toPrecision(5), unit };
};
