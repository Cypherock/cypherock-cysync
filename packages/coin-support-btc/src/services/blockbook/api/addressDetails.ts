import { btcCoinList } from '@cypherock/coins';
import axios from 'axios';

import { config } from '../../../config';

const baseURL = `${config.API_CYPHEROCK}/v2`;

export interface IBlockbookToken {
  type: 'XPUBAddress';
  name: string;
  path: string;
  transfers: number;
  decimals: number;
  balance: string;
  totalReceived: string;
  totalSent: string;
}

export interface IBlockbookTransactionInput {
  txid: string;
  vout: number;
  sequence: number;
  n: number;
  addresses: string[];
  isAddress: boolean;
  value: string;
  hex: string;
}

export interface IBlockbookTransactionOutput {
  value: string;
  n: number;
  spent: boolean;
  hex: string;
  addresses: string[];
  isAddress: boolean;
}

export interface IBlockbookTransaction {
  txid: string;
  version: number;
  vin: IBlockbookTransactionInput[];
  vout: IBlockbookTransactionOutput[];
  blockHash: string;
  blockHeight: number;
  confirmations: number;
  blockTime: number;
  value: string;
  valueIn: string;
  fees: string;
  hex: string;
}

export interface IXpubDetails {
  page: number;
  totalPages: number;
  itemsOnPage: number;
  address: string;
  balance: string;
  totalReceived: string;
  totalSent: string;
  unconfirmedBalance: string;
  unconfirmedTxs: number;
  txs: number;
  transactions?: IBlockbookTransaction[];
  usedTokens: number;
  tokens?: IBlockbookToken[];
}

export const getXpubDetails = async (params: {
  xpub: string;
  coinId: string;
  page: number;
  limit?: number;
  from?: number;
  to?: string;
}): Promise<IXpubDetails> => {
  const coin = btcCoinList[params.coinId];

  const url = `${baseURL}/transaction`;
  const response = await axios.post(url, {
    xpub: params.xpub,
    coinType: coin.apiCoinType,
    page: params.page,
    limit: params.limit,
    from: params.from,
    to: params.to,
  });

  return response.data;
};

export interface ITokenItem {
  type: string;
  name: string;
  path: string;
  transfers: number;
  decimals: number;
}

export interface IDerivedAddresses {
  address: string;
  balance: string;
  totalReceived: string;
  totalSent: string;
  unconfirmedBalance: string;
  unconfirmedTxs: number;
  txs: number;
  usedTokens: number;
  tokens: ITokenItem[];
}

export const getDerivedAddresses = async (params: {
  xpub: string;
  coinId: string;
}): Promise<IDerivedAddresses> => {
  const coin = btcCoinList[params.coinId];

  const url = `${baseURL}/derived-addresses`;
  const response = await axios.post(url, {
    xpub: params.xpub,
    coinType: coin.apiCoinType,
  });

  return response.data;
};
