import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { icpCoinList, IcpIdMap } from '@cypherock/coins';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const { transaction } = params;

  if (transaction.assetId === IcpIdMap.icp) {
    return `https://dashboard.internetcomputer.org/transaction/${transaction.hash}`;
  }
  const tokenDetails =
    icpCoinList[transaction.parentAssetId].tokens[transaction.assetId];
  return `https://dashboard.internetcomputer.org/${tokenDetails.dashboardRoute}/transaction/${transaction.hash}`;
};
