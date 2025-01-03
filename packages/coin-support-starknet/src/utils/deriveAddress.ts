import { starknetCoinList } from '@cypherock/coins';

import { addHexPrefix } from './addHexPrefix';
import { getCoinSupportStarknetLib } from './starknetLib';

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
