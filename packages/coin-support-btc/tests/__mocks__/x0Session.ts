import {
  IX0CardOperations,
  IX0Session,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { HDKey } from '@scure/bip32';

export const MOCK_WALLET_ID = 'ab12cd34';

const MAX_ECDSA_HASHES = 8;
const MAX_SCHNORR_HASHES = 3;

const masterSeed = Uint8Array.from(
  Buffer.from(
    '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
    'hex',
  ),
);

const wrongPassphraseSeed = Uint8Array.from(
  Buffer.from(
    'fffefdfcfbfaf9f8f7f6f5f4f3f2f1f0efeeedecebeae9e8e7e6e5e4e3e2e1e0',
    'hex',
  ),
);

const deriveNode = (path: number[], seed = masterSeed): HDKey => {
  let node = HDKey.fromMasterSeed(seed);
  for (const index of path) {
    node = node.deriveChild(index);
  }
  return node;
};

export const getMockPublicKey = (path: number[]): Uint8Array => {
  const { publicKey } = deriveNode(path);
  if (!publicKey) throw new Error('Failed to derive mock public key');
  return publicKey;
};

const bytesToNumberBE = (bytes: Uint8Array): bigint =>
  BigInt(`0x${Buffer.from(bytes).toString('hex')}`);

const numberToBytesBE = (value: bigint, length: number): Uint8Array =>
  Uint8Array.from(
    Buffer.from(value.toString(16).padStart(length * 2, '0'), 'hex'),
  );

/** BIP-341 key-path tweak (empty merkle root) of a private key. */
export const tweakPrivateKey = (privateKey: Uint8Array): Uint8Array => {
  const { n } = secp256k1.CURVE;
  const point = secp256k1.ProjectivePoint.fromPrivateKey(privateKey);
  const hasEvenY = point.toAffine().y % BigInt(2) === BigInt(0);
  const d = hasEvenY
    ? bytesToNumberBE(privateKey)
    : n - bytesToNumberBE(privateKey);
  const tweak = bytesToNumberBE(
    schnorr.utils.taggedHash('TapTweak', point.toRawBytes(true).slice(1)),
  );
  return numberToBytesBE((d + tweak) % n, 32);
};

export interface IMockX0SessionOptions {
  /** Sign Schnorr with the raw leaf key, i.e. a card that skips the tweak. */
  skipTaprootTweak?: boolean;
  /** Derive from another seed, as the card does with a wrong passphrase. */
  wrongPassphrase?: boolean;
}

/**
 * Fake IX0Session backed by a deterministic in-memory HD tree, standing in
 * for the card. deriveKeys/signHashes behave like the real card: raw pubkeys
 * or xpubs on demand, DER low-S ECDSA or BIP-340 Schnorr (under the BIP-341
 * tweak) over precomputed digests, with the card's per-call batch limits.
 */
export const createMockX0Session = (
  walletId: string = MOCK_WALLET_ID,
  options: IMockX0SessionOptions = {},
): IX0Session => {
  const seed = options.wrongPassphrase ? wrongPassphraseSeed : masterSeed;
  const cardOperations: IX0CardOperations = {
    deriveKeys: async ({ paths, format }) =>
      paths.map(path => {
        const node = deriveNode(path, seed);
        if (!node.publicKey || !node.chainCode) {
          throw new Error('Failed to derive mock key');
        }
        if (format === 'xpub') {
          return {
            publicKey: node.publicKey,
            chainCode: node.chainCode,
            xpub: node.publicExtendedKey,
          };
        }
        return { publicKey: node.publicKey };
      }),
    signHashes: async ({ path, hashes, scheme = 'ecdsa-der' }) => {
      const node = deriveNode(path, seed);
      if (!node.privateKey) throw new Error('Failed to derive mock key');
      const { privateKey } = node;

      if (scheme === 'schnorr-bip340') {
        if (hashes.length > MAX_SCHNORR_HASHES) {
          throw new Error('Schnorr batch over the card limit');
        }
        const signingKey = options.skipTaprootTweak
          ? privateKey
          : tweakPrivateKey(privateKey);
        return hashes.map(hash => ({
          signature: schnorr.sign(hash, signingKey),
        }));
      }

      if (hashes.length > MAX_ECDSA_HASHES) {
        throw new Error('ECDSA batch over the card limit');
      }
      return hashes.map(hash => ({
        signature: secp256k1
          .sign(hash, privateKey, { lowS: true })
          .toDERRawBytes(),
      }));
    },
  };

  return {
    walletId,
    runTap: async (op, hooks) => {
      hooks?.onEvent?.(X0FlowEvent.INIT);
      hooks?.onEvent?.(X0FlowEvent.CARD_CONNECTED);
      const result = await op(cardOperations);
      hooks?.onEvent?.(X0FlowEvent.PIN_VERIFIED);
      return result;
    },
    abort: async () => undefined,
  };
};
