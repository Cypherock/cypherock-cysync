import {
  CoingeckoCoinListItem,
  TokenAutomationParams,
  TokenListItem,
} from '../../../../src';

export interface IValidTokenDiffTestCase {
  name: string;
  params: TokenAutomationParams;
  result: TokenListItem[];
  mocks: {
    coingeckoList: CoingeckoCoinListItem[];
  };
}
