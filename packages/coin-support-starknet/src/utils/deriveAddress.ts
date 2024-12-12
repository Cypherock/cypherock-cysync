import { starknetCoinList } from '@cypherock/coins';

import { getCoinSupportStarknetLib } from './starknetLib';

const removeHexPrefix = (hex: string) => hex.replace(/^0x/i, '');

const addHexPrefix = (hex: string) => `0x0${removeHexPrefix(hex)}`;

export const deriveAddress = (publicKey: string, assetId: string) => {
  const starknetLib = getCoinSupportStarknetLib();
  const constructorAXCallData = starknetLib.CallData.compile([0, publicKey, 1]);
  const accountAXAddress = starknetLib.hash.calculateContractAddressFromHash(
    publicKey,
    starknetCoinList[assetId].argentXClassHash,
    constructorAXCallData,
    0,
  );
  return addHexPrefix(accountAXAddress);
};
