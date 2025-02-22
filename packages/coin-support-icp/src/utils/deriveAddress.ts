import crc32 from 'crc-32';
import { ec as EC } from 'elliptic';
import { sha224 as SHA224 } from 'sha.js';

const secp256k1 = new EC('secp256k1');

const SECP256K1_OID = Array.from([
  ...[0x30, 0x10], // SEQUENCE
  ...[0x06, 0x07], // OID with 7 bytes
  ...[0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01], // OID ECDSA
  ...[0x06, 0x05], // OID with 5 bytes
  ...[0x2b, 0x81, 0x04, 0x00, 0x0a], // OID secp256k1
]);

const SELF_AUTHENTICATING_SUFFIX = 2;

const decompressPublicKey = (compressedKey: string) => {
  const key = secp256k1.keyFromPublic(compressedKey, 'hex');

  return key.getPublic().encode('array', false);
};

const getDerEncodedPublicKey = (publicKey: number[]) => {
  const oidPrefixedPubKey = Array.from([
    ...SECP256K1_OID,
    ...[0x03, publicKey.length + 1, 0x00], // Bit string tag (0x03), publicKey.byteLength + 1, padding 0x00
    ...publicKey,
  ]);

  return Uint8Array.from([
    ...[0x30, oidPrefixedPubKey.length],
    ...oidPrefixedPubKey,
  ]);
};

const deriveAccountIdFromPrincipal = (
  principal: Uint8Array,
  subaccountIdentifer = Buffer.alloc(32).fill(0),
) => {
  const buffer = new Uint8Array([
    ...Array.from(Buffer.from('\x0Aaccount-id')),
    ...Array.from(principal),
    ...Array.from(subaccountIdentifer),
  ]);

  const hash = new SHA224().update(buffer).digest();

  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32.buf(hash) >>> 0, 0); // eslint-disable-line no-bitwise

  return Buffer.concat([checksum, hash]).toString('hex');
};

export const derivePrincipal = (publicKey: string) => {
  const uncompressedPubKey = decompressPublicKey(publicKey);

  const derEncodedPubKey = getDerEncodedPublicKey(uncompressedPubKey);

  const hash = new SHA224().update(derEncodedPubKey).digest();

  return Uint8Array.from([...Array.from(hash), SELF_AUTHENTICATING_SUFFIX]);
};

export const deriveAddress = (publicKey: string) =>
  deriveAccountIdFromPrincipal(derivePrincipal(publicKey));
