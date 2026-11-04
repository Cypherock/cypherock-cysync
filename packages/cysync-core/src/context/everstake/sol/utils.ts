import { BigNumber } from '@cypherock/cysync-utils';

import { LAMPORTS_PER_SOL } from './types';

export const lamportsToSol = (lamports: string | undefined): BigNumber =>
  new BigNumber(lamports && lamports !== '' ? lamports : '0').dividedBy(
    LAMPORTS_PER_SOL,
  );

export const formatSol = (
  lamports: string | undefined,
  maxDecimals = 6,
): string => {
  const value = lamportsToSol(lamports);
  if (value.isNaN()) return '0';
  return (
    value.toFixed(maxDecimals, BigNumber.ROUND_FLOOR).replace(/\.?0+$/, '') ||
    '0'
  );
};
