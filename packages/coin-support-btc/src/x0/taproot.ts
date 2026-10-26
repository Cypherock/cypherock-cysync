import { compressPublicKey } from '@cypherock/coin-support-utils';
import { getBitcoinJsLib } from '@cypherock/sdk-app-btc';
import { assert } from '@cypherock/sdk-utils';

/** BIP-340 x-only form of a leaf public key: the taproot internal key. */
export const toXOnlyPublicKey = (publicKey: Uint8Array): Uint8Array =>
  compressPublicKey(publicKey).slice(1, 33);

/**
 * BIP-341 key-path output key (empty merkle root) of a leaf public key. The
 * card's Schnorr signatures verify against this key, not the leaf key.
 */
export const getTaprootOutputKey = (publicKey: Uint8Array): Uint8Array => {
  const { pubkey } = getBitcoinJsLib().payments.p2tr({
    internalPubkey: Buffer.from(toXOnlyPublicKey(publicKey)),
  });
  assert(pubkey, 'Failed to compute taproot output key');
  return Uint8Array.from(pubkey);
};
