import { HyspChain } from '@cypherock/coin-support-evm';
import { EvmIdMap } from '@cypherock/coins';

export const MEV_USD_ADDRESS: Record<HyspChain, string> = {
  eth_mainnet: '0x548857309BEfb6Fb6F20a9C5A56c9023D892785B',
  base: '0xccbad2823328BCcAEa6476Df3Aa529316aB7474A',
};

export const TOKEN_ADDRESSES: Record<
  HyspChain,
  { usdc: string; usdt: string | null }
> = {
  eth_mainnet: {
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  base: {
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdt: null,
  },
};

export const COIN_ID_TO_CHAIN: Partial<Record<string, HyspChain>> = {
  [EvmIdMap.ethereum]: 'eth_mainnet',
  [EvmIdMap.base]: 'base',
};
