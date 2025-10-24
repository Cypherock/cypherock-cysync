import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const { transaction } = params;

  // If we its getting called from history we have its hash, else we redirect to address
  if (transaction.hash && transaction.hash !== '') {
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
