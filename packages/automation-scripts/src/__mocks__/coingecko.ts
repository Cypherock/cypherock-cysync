import { jest } from '@jest/globals';
import { CoingeckoCoinDetails, CoingeckoCoinListItem } from '../tokens';

export const getCoingeckoCoinList =
  jest.fn<() => Promise<CoingeckoCoinListItem[]>>();
export const getCoingeckoCoinDetails =
  jest.fn<() => Promise<CoingeckoCoinDetails>>();

jest.mock('../tokens/coingecko', () => {
  const originalModule: any = jest.requireActual('../../src/tokens/coingecko');

  return {
    __esModule: true,
    ...originalModule,
    getCoingeckoCoinList,
    getCoingeckoCoinDetails,
  };
});
