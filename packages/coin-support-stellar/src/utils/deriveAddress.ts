import { getCoinSupportStellarLib } from './stellarLib';

export const deriveAddress = (publicKey: string): string => {
  const stellarLib = getCoinSupportStellarLib();

  // If it's already a Stellar address, return it
  if (stellarLib.StrKey.isValidEd25519PublicKey(publicKey)) {
    return publicKey;
  }

  try {
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    return stellarLib.StrKey.encodeEd25519PublicKey(publicKeyBuffer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to derive Stellar address: ${errorMessage}`);
  }
};
