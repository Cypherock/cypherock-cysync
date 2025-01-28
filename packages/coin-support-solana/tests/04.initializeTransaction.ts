import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import * as solanaWeb3 from '@solana/web3.js';
import * as splTokenLib from '@solana/spl-token';

import * as testData from './__fixtures__/04.initializeTransaction';
import * as serviceMock from './__mocks__/services';

import * as solanaAppMock from './__mocks__/solanaApp';

import { SolanaSupport } from '../src';

describe('04. Create Transaction', () => {
  let support: SolanaSupport;

  beforeEach(() => {
    SolanaSupport.setWeb3Library(solanaWeb3);
    SolanaSupport.setSplTokenLibrary(splTokenLib);
    support = new SolanaSupport();

    serviceMock.getFees.mockClear();
    serviceMock.getPriorityFees.mockClear();
    serviceMock.getSimulationComputeUnits.mockClear();

    solanaAppMock.getLatestBlockHash.mockClear();
    solanaAppMock.getLatestBlockHash.mockReturnValue(
      Promise.resolve('6Rmcyocvzr1PW1Me1edJhEzzaVmA1dzfzVjBMf2jFAhY'),
    );
  });

  describe('should be able to create transaction', () => {
    testData.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const getOneMock = jest.fn().mockReturnValue(testCase.mocks.account);
        const db = {
          account: {
            getOne: getOneMock,
          },
        } as any;
        serviceMock.getFees.mockReturnValue(
          Promise.resolve(testCase.mocks.fees),
        );
        serviceMock.getPriorityFees.mockReturnValue(
          Promise.resolve(testCase.mocks.computeUnitPriceMicroLamports),
        );
        serviceMock.getSimulationComputeUnits.mockReturnValue(
          Promise.resolve(testCase.mocks.computeUnits),
        );

        const result = await support.initializeTransaction({
          db,
          accountId: testCase.txn.accountId,
        });

        expect(result).toBeDefined();
        expect(result).toEqual(testCase.txn);
      });
    });
  });
});
