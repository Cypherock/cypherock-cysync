import { HDKey } from '@scure/bip32';

const HARDENED_OFFSET = 0x80000000;

export interface IBip32Versions {
  public: number;
  private: number;
}

/**
 * CKDpub over a base58check xpub — lets X0 flows compute leaf public keys
 * host-side without extra card round-trips. Non-hardened only; `versions`
 * is required for non-standard version words.
 */
export function deriveChildPublicKey(
  xpub: string,
  relativePath: number[],
  versions?: IBip32Versions,
): Uint8Array {
  let node = HDKey.fromExtendedKey(xpub, versions);

  for (const index of relativePath) {
    if (index >= HARDENED_OFFSET) {
      throw new Error('Cannot derive a hardened child from an xpub');
    }
    node = node.deriveChild(index);
  }

  if (!node.publicKey) {
    throw new Error('Failed to derive public key from xpub');
  }

  return node.publicKey;
}
