import { nearCoinList } from '@cypherock/coins';
import axios from 'axios';

import { ServerError, ServerErrorType } from '@cypherock/coin-support-utils';
import { config } from '../config';
import {
  NearBalanceApiResponseSchema,
  NearTransactionsApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}/v2/near`;

export const getBalance = async (
  address: string,
  assetId: string,
): Promise<{
  balance: string;
}> => {
  const url = `${baseURL}/wallet/balance`;
  const response = await axios.post(url, {
    address,
    network: nearCoinList[assetId].network,
  });

  const parseResult = NearBalanceApiResponseSchema.safeParse(response.data);

  if (parseResult.success === false) {
    throw new ServerError(
      ServerErrorType.INVALID_RESPONSE,
      'Invalid Response for Near Balance',
      {
        responseBody: response.data,
        url,
        status: response.status,
      },
    );
  }

  const balance = parseResult.data.nearBalance;
  return {
    balance: balance.toString(),
  };
};

interface GetTransactionsParams {
  address: string;
  assetId: string;
  limit: number;
  offset: number;
}

export const getTransactions = async ({
  address,
  assetId,
  limit,
  offset,
}: GetTransactionsParams) => {
  const url = `${baseURL}/transaction/history`;
  const response = await axios.post(url, {
    address,
    network: nearCoinList[assetId].network,
    limit,
    offset,
  });

  const parseResult = NearTransactionsApiResponseSchema.safeParse(
    response.data,
  );

  if (parseResult.success === false) {
    throw new ServerError(
      ServerErrorType.INVALID_RESPONSE,
      'Invalid Response for Near Transactions',
      {
        responseBody: response.data,
        url,
        status: response.status,
      },
    );
  }

  const hasMore = parseResult.data.length === limit;
  return {
    transactions: parseResult.data,
    hasMore,
  };
};

export const getTransactionCount = async (address: string, assetId: string) => {
  const { transactions } = await getTransactions({
    address,
    assetId,
    limit: 50,
    offset: 0,
  });

  const isUsed = transactions && transactions.length > 0;

  return isUsed ? 1 : 0;
};
