import { sha256 } from '@noble/hashes/sha2';
import { createBase58check } from '@scure/base';
import { HDKey } from '@scure/bip32';

const HARDENED_OFFSET = 0x80000000;
const EXTENDED_KEY_LENGTH = 78;

const base58check = createBase58check(sha256);

const decodeExtendedKey = (extendedKey: string): Uint8Array => {
  const bytes = base58check.decode(extendedKey);
  if (bytes.length !== EXTENDED_KEY_LENGTH) {
    throw new Error('Invalid extended key length');
  }
  return bytes;
};

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

/** The 4-byte version word of a base58check extended key (xpub, zpub, …). */
export function getExtendedKeyVersion(extendedKey: string): number {
  const bytes = decodeExtendedKey(extendedKey);
  return new DataView(bytes.buffer, bytes.byteOffset).getUint32(0);
}

/**
 * Re-encodes an extended key under another version word. The version is
 * serialization metadata only, so the key material is unchanged.
 */
export function setExtendedKeyVersion(
  extendedKey: string,
  version: number,
): string {
  const bytes = Uint8Array.from(decodeExtendedKey(extendedKey));
  new DataView(bytes.buffer).setUint32(0, version);
  return base58check.encode(bytes);
}
