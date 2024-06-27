import { BigNumber, makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import {
  TronAccountDetailsApiResponse,
  TronAccountDetailsApiResponseSchema,
} from '../validators';
import { getAsset } from '@cypherock/coin-support-utils';
import { ITronTrc20Token } from '@cypherock/coins';
import { triggerConstantContractCall } from './triggerconstantcontract';
import { getCoinSupportTronWeb } from '../../utils';

const baseURL = `${config.API_CYPHEROCK}/tron/wallet`;

export const getAccountDetailsByAddress = async (
  address: string,
): Promise<TronAccountDetailsApiResponse> => {
  const url = `${baseURL}/address`;

  const response = await makePostRequest(url, { address });

  const result = TronAccountDetailsApiResponseSchema.safeParse(response.data);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return result.data;
};

export const getBalanceAndTransactionsCount = async (
  address: string,
): Promise<{ balance: string; txnCount: number }> => {
  const addressDetails = await getAccountDetailsByAddress(address);

  return {
    balance: addressDetails.balance,
    txnCount: addressDetails.txs,
  };
};

export const getContractBalance = async (params: {
  address: string;
  parentAssetId: string;
  assetId: string;
}) => {
  const tronWeb = getCoinSupportTronWeb();
  const asset = getAsset(
    params.parentAssetId,
    params.assetId,
  ) as ITronTrc20Token;

  const ownerAddress = tronWeb.address.toHex(params.address) as string;
  const contractAddress = tronWeb.address.toHex(asset.address) as string;
  const parameter = ownerAddress.padStart(64, '0');

  const response = await triggerConstantContractCall({
    contract_address: contractAddress,
    function_selector: 'balanceOf(address)',
    parameter,
    owner_address: ownerAddress,
  });

  const balance = new BigNumber(response.constant_result[0], 16).toString();

  return balance;
};
