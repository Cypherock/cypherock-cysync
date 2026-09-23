import {
  SignMessageDeviceEvent,
  SignMessageType,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  createX0EventEmitter,
  derToRS,
  mapDerivationPath,
  recoverRecid,
  SignMessageFromX0,
  verifyDerSignature,
} from '@cypherock/coin-support-utils';
import { assert, uint8ArrayToHex } from '@cypherock/sdk-utils';

import { getCoinSupportEthersLib } from '../../utils';

const X0_LEAF_DEPTH = 5;

/**
 * Computes the digest the X1 firmware would sign for each message type.
 * Messages arrive hex-encoded (same contract as the X1 flow, which decodes
 * them via hexToUint8Array before sending to the device).
 */
const computeMessageDigest = (payload: {
  signingType: SignMessageType;
  message: string;
}): Uint8Array => {
  const ethers = getCoinSupportEthersLib();
  const messageHex = payload.message.startsWith('0x')
    ? payload.message
    : `0x${payload.message}`;

  switch (payload.signingType) {
    case SignMessageType.PRIVATE_MESSAGE:
    case SignMessageType.ETH_MESSAGE:
      // Both personal_sign and eth_sign apply the EIP-191 prefix, matching
      // the X1 firmware behavior for these message types.
      return ethers.getBytes(ethers.hashMessage(ethers.getBytes(messageHex)));
    case SignMessageType.TYPED_MESSAGE: {
      const parsed = JSON.parse(payload.message);
      const types = { ...parsed.types };
      delete types.EIP712Domain;
      return ethers.getBytes(
        ethers.TypedDataEncoder.hash(parsed.domain, types, parsed.message),
      );
    }
    default:
      throw new Error(`invalid signing type ${payload.signingType}`);
  }
};

export const signMessageFromX0: SignMessageFromX0 = async params => {
  const { x0, observer, account, payload } = params;

  const ethers = getCoinSupportEthersLib();
  const derivationPath = mapDerivationPath(account.derivationPath);
  assert(
    derivationPath.length === X0_LEAF_DEPTH,
    new Error('X0 can only sign for depth-5 derivation paths'),
  );

  const digest = computeMessageDigest(payload);

  const emitter = createX0EventEmitter<SignMessageDeviceEvent>(observer, {
    [X0FlowEvent.INIT]: SignMessageDeviceEvent.INIT,
    [X0FlowEvent.CARD_CONNECTED]: SignMessageDeviceEvent.CARD_TAPPED,
  });

  const { signature, publicKey } = await x0.runTap(
    async card => {
      const [keyResult] = await card.deriveKeys({
        paths: [derivationPath],
        format: 'raw-pubkey',
      });
      const [signResult] = await card.signHashes({
        path: derivationPath,
        hashes: [digest],
      });
      return {
        signature: signResult.signature,
        publicKey: keyResult.publicKey,
      };
    },
    { onEvent: emitter.onEvent },
  );

  emitter.markDone();

  assert(
    verifyDerSignature(digest, signature, publicKey),
    new Error('X0 signature verification failed'),
  );

  const derivedAddress = ethers.computeAddress(
    `0x${uint8ArrayToHex(publicKey)}`,
  );
  assert(
    derivedAddress.toLowerCase() === account.xpubOrAddress.toLowerCase(),
    new Error('X0 derived a different address than the account'),
  );

  const { r, s } = derToRS(signature);
  const recid = recoverRecid(digest, signature, publicKey);

  return ethers.Signature.from({
    r: `0x${uint8ArrayToHex(r)}`,
    s: `0x${uint8ArrayToHex(s)}`,
    v: 27 + recid,
  }).serialized;
};
