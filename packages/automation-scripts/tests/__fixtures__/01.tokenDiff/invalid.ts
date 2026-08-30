import { erc20TokenAutomationParams } from '../../../src/commands/erc20/params';

export interface IInvalidTokenDiffTestCase {
  name: string;
  params: any;
}

const validParams = erc20TokenAutomationParams;

export const invalid: IInvalidTokenDiffTestCase[] = [
  {
    name: 'With no params',
    params: undefined,
  },
  {
    name: 'With no generate id function',
    params: {
      ...validParams,
      createTokenAssetId: undefined,
    },
  },
  {
    name: 'With no token list',
    params: {
      ...validParams,
      tokenJsonList: undefined,
    },
  },
  {
    name: 'With no coin list',
    params: {
      ...validParams,
      coinList: undefined,
    },
  },
  {
    name: 'With no coin id map',
    params: {
      ...validParams,
      coinIdMap: undefined,
    },
  },
  {
    name: 'With no coingecko platform mapping',
    params: {
      ...validParams,
      coingeckoPlatformMapping: undefined,
    },
  },
  {
    name: 'With no file prefix',
    params: {
      ...validParams,
      filePrefix: undefined,
    },
  },
];
