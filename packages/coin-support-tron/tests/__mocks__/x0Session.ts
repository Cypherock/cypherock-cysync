import {
  IX0CardOperations,
  IX0Session,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import { secp256k1 } from '@noble/curves/secp256k1';
import { HDKey } from '@scure/bip32';

export const MOCK_WALLET_ID = 'ab12cd34';

const masterSeed = Uint8Array.from(
  Buffer.from(
    '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
    'hex',
  ),
);

const deriveNode = (path: number[]): HDKey => {
  let node = HDKey.fromMasterSeed(masterSeed);
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

/**
 * Fake IX0Session backed by a deterministic in-memory HD tree, standing in
 * for the card. deriveKeys/signHashes behave like the real card: raw pubkeys
 * or xpubs on demand, DER low-S signatures over precomputed digests.
 */
export const createMockX0Session = (
  walletId: string = MOCK_WALLET_ID,
): IX0Session => {
  const cardOperations: IX0CardOperations = {
    deriveKeys: async ({ paths, format }) =>
      paths.map(path => {
        const node = deriveNode(path);
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
    signHashes: async ({ path, hashes }) => {
      const node = deriveNode(path);
      if (!node.privateKey) throw new Error('Failed to derive mock key');
      return hashes.map(hash => ({
        signature: secp256k1
          .sign(hash, node.privateKey as Uint8Array, { lowS: true })
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
