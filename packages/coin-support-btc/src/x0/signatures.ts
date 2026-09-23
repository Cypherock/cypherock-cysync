import { compressPublicKey } from '@cypherock/coin-support-utils';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

const DER_REGION_LENGTH = 72;

/**
 * Synthesizes the signature blob format the X1 device produces, which
 * createSignedTransaction consumes: [prefix byte][DER][33-byte pubkey].
 * The DER region is zero-padded to a fixed length so every blob in a
 * transaction has the same total length (the nested-segwit branch of
 * createSignedTransaction slices the pubkey using the first blob's length).
 */
export const toDeviceSignatureFormat = (
  derSignature: Uint8Array,
  leafPublicKey: Uint8Array,
): string => {
  if (derSignature.length > DER_REGION_LENGTH) {
    throw new Error('DER signature longer than expected');
  }

  const padding = new Uint8Array(DER_REGION_LENGTH - derSignature.length);

  return (
    uint8ArrayToHex(Uint8Array.of(derSignature.length)) +
    uint8ArrayToHex(derSignature) +
    uint8ArrayToHex(padding) +
    uint8ArrayToHex(compressPublicKey(leafPublicKey))
  );
};
