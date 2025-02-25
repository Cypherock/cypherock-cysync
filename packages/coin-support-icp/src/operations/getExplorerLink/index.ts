import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';

export const getExplorerLink = (params: IGetExplorerLink) =>
  `https://dashboard.internetcomputer.org/transaction/${params.transaction.hash}`;
