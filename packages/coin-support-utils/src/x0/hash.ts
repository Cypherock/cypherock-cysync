import { sha256, sha512 } from '@noble/hashes/sha2';

export { sha256 };

/** SHA-512 truncated to the first 32 bytes (XRPL "sha512half"). */
export const sha512Half = (data: Uint8Array): Uint8Array =>
  sha512(data).slice(0, 32);
