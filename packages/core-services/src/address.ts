import { getCoinSupport } from '@cypherock/coin-support';

export const formatAddress = (params: {
  familyId: string;
  coinId: string;
  address: string;
}) => {
  const coinSupport = getCoinSupport(params.familyId);

  return coinSupport.formatAddress(params);
};
