import { IAccount } from '@cypherock/db-interfaces';
import { describe, expect, test } from '@jest/globals';

import './__mocks__/services';

import { getTransactionParser } from '../src/operations/syncAccount';
import { TronTransaction } from '../src/services/validators';

const MY_ADDRESS = 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8';
const OTHER_ADDRESS = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
const THIRD_ADDRESS = 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7';

const account = {
  __id: 'account-1',
  walletId: 'ab12cd34',
  assetId: 'tron',
  familyId: 'tron',
  xpubOrAddress: MY_ADDRESS,
} as IAccount;

const makeTransaction = (vinAddresses: string[]): TronTransaction => ({
  txid: '0xabc',
  vin: vinAddresses.map((address, n) => ({
    n,
    addresses: [address],
    isAddress: true,
  })),
  vout: [{ n: 0, addresses: [THIRD_ADDRESS], isAddress: true }],
  blockHeight: 1,
  blockTime: 1,
  confirmations: 1,
  value: '1000000',
  fees: '0',
  ethereumSpecific: { status: 1, nonce: 0 },
});

describe('03. Sync account transaction parser', () => {
  const parse = getTransactionParser({ address: MY_ADDRESS, account });

  test('marks a send when our address is the only input', () => {
    expect(parse(makeTransaction([MY_ADDRESS])).type).toEqual('send');
  });

  test('marks a send when our address is not the last input', () => {
    expect(parse(makeTransaction([MY_ADDRESS, OTHER_ADDRESS])).type).toEqual(
      'send',
    );
  });

  test('marks a receive when our address is not an input', () => {
    expect(parse(makeTransaction([OTHER_ADDRESS])).type).toEqual('receive');
  });
});
