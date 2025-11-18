import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const { transaction } = params;

  if (transaction.confirmations !== 0) {
    return `https://siascan.com/tx/${transaction.hash}`;
  }

  const userAddress =
    transaction.inputs.find(input => input.isMine)?.address ??
    transaction.outputs.find(output => output.isMine)?.address;

  if (!userAddress) {
    throw new Error('Cannot determine address for explorer link');
  }

  return `https://siascan.com/address/${userAddress}`;
};
