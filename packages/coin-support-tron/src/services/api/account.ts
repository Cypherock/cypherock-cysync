import { BigNumber, makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import { getCoinSupportTronWeb } from '../../utils';
import {
  TronAccountDetail,
  TronAccountDetailApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}/tron/wallet`;

export const getAccountsDetailByAddress = async (
  address: string,
): Promise<Required<TronAccountDetail>> => {
  const url = `${baseURL}/address`;

  const response = await makePostRequest(url, { address });

  const result = TronAccountDetailApiResponseSchema.safeParse(response.data);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return {
    details: {},
    nonTokenTxs: 0,
    ...result.data,
  };
};

export const getBalanceAndTransactionsCount = async (
  address: string,
): Promise<{ balance: string; txnCount: number }> => {
  const accountDetails = await getAccountsDetailByAddress(address);
  return {
    balance: accountDetails.balance,
    txnCount: accountDetails.txs,
  };
};

export interface IEstimateTrc20SendEnergyConsumptionResult {
  result?: {
    result?: boolean;
    code?: string;
    message?: string;
  };
  energy_required?: number;
}

export const estimateTrc20SendEnergyConsumption = async (params: {
  from: string;
  to: string;
  contract: string;
  amount: string;
}): Promise<IEstimateTrc20SendEnergyConsumptionResult> => {
  const tronWeb = getCoinSupportTronWeb();

  const amount = new BigNumber(params.amount).toString(16).padStart(64, '0');
  const fromAddress = tronWeb.address.toHex(params.from);
  const toAddress = tronWeb.address.toHex(params.to);
  const contractAddress = tronWeb.address.toHex(params.contract);

  const data = {
    contract_address: contractAddress,
    owner_address: fromAddress,
    function_selector: 'transfer(address,uint256)',
    parameter: `${toAddress.padStart(64, '0')}${amount}`,
  };

  const url = `${baseURL}/estimateenergy`;

  const response = await makePostRequest(url, data);

  return response.data;
};
