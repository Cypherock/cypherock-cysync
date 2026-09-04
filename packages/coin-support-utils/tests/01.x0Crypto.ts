import { secp256k1 } from '@noble/curves/secp256k1';
import { HDKey } from '@scure/bip32';

import {
  chunkArray,
  compressPublicKey,
  decompressPublicKey,
  deriveChildPublicKey,
  derToCompact,
  derToRS,
  groupByLeafPath,
  recoverRecid,
  sha256,
  sha512Half,
  verifyDerSignature,
} from '../src/x0';

const hexToBytes = (hex: string): Uint8Array =>
  Uint8Array.from(Buffer.from(hex, 'hex'));
const bytesToHex = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('hex');

describe('x0 bip32 helpers', () => {
  // BIP32 spec test vector 1: m/0'/1/2' and its non-hardened descendant
  // m/0'/1/2'/2/1000000000. Both xpub strings come straight from the spec.
  const parentXpub =
    'xpub6D4BDPcP2GT577Vvch3R8wDkScZWzQzMMUm3PWbmWvVJrZwQY4VUNgqFJPMM3No2dFDFGTsxxpG5uJh7n7epu4trkrX7x7DogT5Uv6fcLW5';
  const childXpub =
    'xpub6H1LXWLaKsWFhvm6RVpEL9P4KfRZSW7abD2ttkWP3SSQvnyA8FSVqNTEcYFgJS2UaFcxupHiYkro49S8yGasTvXEYBVPamhGW6cFJodrTHy';

  test('derives a non-hardened descendant public key from an xpub', () => {
    const expected = HDKey.fromExtendedKey(childXpub).publicKey;
    const derived = deriveChildPublicKey(parentXpub, [2, 1000000000]);
    expect(bytesToHex(derived)).toEqual(bytesToHex(expected ?? new Uint8Array()));
  });

  test('rejects hardened indices', () => {
    expect(() => deriveChildPublicKey(parentXpub, [0x80000000])).toThrow(
      'hardened',
    );
  });
});

describe('x0 signature helpers', () => {
  const privateKey = hexToBytes(
    '0000000000000000000000000000000000000000000000000000000000000001',
  );
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  const digest = sha256(new TextEncoder().encode('x0 digest under test'));
  const signature = secp256k1.sign(digest, privateKey, { prehash: false });
  const der = signature.toDERRawBytes();

  test('derToCompact matches the source signature', () => {
    expect(bytesToHex(derToCompact(der))).toEqual(
      bytesToHex(signature.toCompactRawBytes()),
    );
  });

  test('derToRS splits into 32-byte scalars', () => {
    const { r, s } = derToRS(der);
    expect(r).toHaveLength(32);
    expect(s).toHaveLength(32);
    expect(bytesToHex(derToCompact(der))).toEqual(
      bytesToHex(r) + bytesToHex(s),
    );
  });

  test('verifyDerSignature accepts a valid signature', () => {
    expect(verifyDerSignature(digest, der, publicKey)).toBe(true);
  });

  test('verifyDerSignature rejects a wrong digest or signer', () => {
    const otherDigest = sha256(new TextEncoder().encode('other'));
    const otherPub = secp256k1.getPublicKey(
      hexToBytes(
        '0000000000000000000000000000000000000000000000000000000000000002',
      ),
      true,
    );
    expect(verifyDerSignature(otherDigest, der, publicKey)).toBe(false);
    expect(verifyDerSignature(digest, der, otherPub)).toBe(false);
    expect(verifyDerSignature(digest, new Uint8Array([1, 2, 3]), publicKey)).toBe(
      false,
    );
  });

  test('recoverRecid recovers the correct recovery id', () => {
    const recid = recoverRecid(digest, der, publicKey);
    expect(recid).toEqual(signature.recovery);
  });

  test('recoverRecid accepts an uncompressed expected key', () => {
    const uncompressed = decompressPublicKey(publicKey);
    expect(uncompressed).toHaveLength(65);
    expect(recoverRecid(digest, der, uncompressed)).toEqual(
      signature.recovery,
    );
    expect(bytesToHex(compressPublicKey(uncompressed))).toEqual(
      bytesToHex(publicKey),
    );
  });

  test('recoverRecid throws for an unrelated public key', () => {
    const otherPub = secp256k1.getPublicKey(
      hexToBytes(
        '0000000000000000000000000000000000000000000000000000000000000002',
      ),
      true,
    );
    expect(() => recoverRecid(digest, der, otherPub)).toThrow();
  });
});

describe('x0 hash helpers', () => {
  test('sha256 of empty input matches the known vector', () => {
    expect(bytesToHex(sha256(new Uint8Array()))).toEqual(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });

  test('sha512Half of empty input matches the known vector', () => {
    expect(bytesToHex(sha512Half(new Uint8Array()))).toEqual(
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce',
    );
  });
});

describe('x0 batching helpers', () => {
  test('chunkArray splits into card-sized batches', () => {
    expect(chunkArray([1, 2, 3, 4, 5, 6, 7], 5)).toEqual([
      [1, 2, 3, 4, 5],
      [6, 7],
    ]);
    expect(chunkArray([], 5)).toEqual([]);
  });

  test('groupByLeafPath groups digests by derivation path', () => {
    const items = [
      { path: [0, 1], id: 'a' },
      { path: [0, 2], id: 'b' },
      { path: [0, 1], id: 'c' },
    ];
    const groups = groupByLeafPath(items, item => item.path);
    expect(groups).toHaveLength(2);
    expect(groups[0].path).toEqual([0, 1]);
    expect(groups[0].items.map(i => i.id)).toEqual(['a', 'c']);
    expect(groups[1].items.map(i => i.id)).toEqual(['b']);
  });
});
