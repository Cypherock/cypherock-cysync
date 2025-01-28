import { getTokenSupportSplTokenLib } from './splTokenLib';
import { getCoinSupportWeb3Lib } from './web3';

export const deriveAssociatedTokenAddress = (
  ownerAddress: string,
  mintAddress: string,
) => {
  const coinSupportWeb3Lib = getCoinSupportWeb3Lib();
  const splTokenLibrary = getTokenSupportSplTokenLib();

  const tokenAccount = splTokenLibrary.getAssociatedTokenAddressSync(
    new coinSupportWeb3Lib.PublicKey(mintAddress),
    new coinSupportWeb3Lib.PublicKey(ownerAddress),
  );

  return tokenAccount.toBase58();
};
