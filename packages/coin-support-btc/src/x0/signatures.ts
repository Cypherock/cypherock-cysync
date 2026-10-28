import { compressPublicKey } from '@cypherock/coin-support-utils';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

import { toXOnlyPublicKey } from './taproot';

const DER_REGION_LENGTH = 72;
const SCHNORR_SIGNATURE_LENGTH = 64;

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

/**
 * The taproot blob createSignedTransaction consumes: [64-byte BIP-340
 * signature][32-byte x-only internal key]. It reads the signature from the
 * front and the internal key from the back.
 */
export const toTaprootDeviceSignatureFormat = (
  schnorrSignature: Uint8Array,
  leafPublicKey: Uint8Array,
): string => {
  if (schnorrSignature.length !== SCHNORR_SIGNATURE_LENGTH) {
    throw new Error('Schnorr signature must be 64 bytes');
  }

  return (
    uint8ArrayToHex(schnorrSignature) +
    uint8ArrayToHex(toXOnlyPublicKey(leafPublicKey))
  );
};
