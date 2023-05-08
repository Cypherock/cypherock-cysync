import { describe, expect, test } from '@jest/globals';

import { btcCoinList, evmCoinList, solanaCoinList, nearCoinList } from '../src';

describe('01. All ids should be unique', () => {
  const btcIds = Object.keys(btcCoinList);
  const evmIds = Object.keys(evmCoinList);
  const nearIds = Object.keys(nearCoinList);
  const solanaIds = Object.keys(solanaCoinList);

  const idSet = new Set<string>();

  const testCases = [
    {
      coin: 'Bitcoin',
      listName: 'btcCoinList',
      ids: btcIds,
    },
    {
      coin: 'Evm',
      listName: 'evmCoinList',
      ids: evmIds,
    },
    {
      coin: 'Near',
      listName: 'nearCoinList',
      ids: nearIds,
    },
    {
      coin: 'Solana',
      listName: 'solanaCoinList',
      ids: solanaIds,
    },
  ];

  testCases.forEach(testCase => {
    describe(`${testCase.coin} should have unique ids`, () => {
      for (const id of testCase.ids) {
        test(`${testCase.listName} should have unique id: ${id}`, async () => {
          expect(idSet.has(id)).toEqual(false);
          idSet.add(id);
        });
      }
    });
  });
});
