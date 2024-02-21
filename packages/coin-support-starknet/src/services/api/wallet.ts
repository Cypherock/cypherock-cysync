import { config } from '../../config';

import { getStarknetApiJs } from '@cypherock/sdk-app-starknet/dist/utils';
import logger from '../../utils/logger';

const nodeUrl = `https://starknet-goerli.infura.io/v3/${config.INFURA_STARKNET_API_KEY}`;

const ethContractAddress =
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const strkContractAddress =
  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

const contracts: any = { eth: null, strk: null };
let provider: any = null;

async function initContracts() {
  if (!provider) {
    provider = new (getStarknetApiJs().RpcProvider)({ nodeUrl });
  }

  if (!contracts['eth']) {
    contracts['eth'] = new (getStarknetApiJs().Contract)(
      (await provider.getClassAt(ethContractAddress)).abi,
      ethContractAddress,
      provider,
    );
  }

  if (!contracts['strk']) {
    contracts['strk'] = new (getStarknetApiJs().Contract)(
      (await provider.getClassAt(strkContractAddress)).abi,
      strkContractAddress,
      provider,
    );
  }
}

export const getBalance = async (
  address: string,
  assetId: string,
): Promise<{
  balance: string;
}> => {
  await initContracts();
  let balance = (await contracts.eth!.balanceOf(address)) as bigint;
  if (assetId === 'strk') {
    balance = (await contracts.strk!.balanceOf(address)) as bigint;
  }

  return {
    balance: `${balance}` ?? '0',
  };
};

export const getTransactionCount = async (address: string, assetId: string) => {
  logger.verbose({ assetId });
  if (!provider) {
    provider = new (getStarknetApiJs().RpcProvider)({ nodeUrl });
  }

  try {
    const nonce = await provider.getNonceForAddress(address);
    return nonce;
  } catch {
    return 0;
  }
};
