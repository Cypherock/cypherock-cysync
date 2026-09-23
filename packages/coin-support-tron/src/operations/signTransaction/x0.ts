import {
  SignTransactionDeviceEvent,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  createX0EventEmitter,
  decompressPublicKey,
  derToCompact,
  mapDerivationPath,
  recoverRecid,
  sha256,
  SignTransactionFromX0,
  verifyDerSignature,
} from '@cypherock/coin-support-utils';
import {
  getAddressFromPublicKey,
  ISignedTransaction,
} from '@cypherock/sdk-app-tron';
import { assert, hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';

import { IPreparedTronTransaction } from '../transaction';

const X0_LEAF_DEPTH = 5;

export const signTransactionFromX0: SignTransactionFromX0<
  ISignedTransaction
> = async params => {
  const { x0, observer, transaction, account } = params;

  const derivationPath = mapDerivationPath(account.derivationPath);
  assert(
    derivationPath.length === X0_LEAF_DEPTH,
    new Error('X0 can only sign for depth-5 derivation paths'),
  );

  const txn = (transaction as IPreparedTronTransaction).computedData
    .unsignedTransaction;
  assert(txn, 'Missing unsigned transaction');

  // Tron signs sha256(raw_data). Recompute from raw_data_hex instead of
  // trusting txn.txID, which can be stale after prepare mutates expiration.
  const digest = sha256(hexToUint8Array(txn.raw_data_hex));

  const emitter = createX0EventEmitter<SignTransactionDeviceEvent>(observer, {
    [X0FlowEvent.INIT]: SignTransactionDeviceEvent.INIT,
    [X0FlowEvent.CARD_CONNECTED]: SignTransactionDeviceEvent.CARD_TAPPED,
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

  const derivedAddress = getAddressFromPublicKey(
    decompressPublicKey(publicKey),
  );
  assert(
    derivedAddress === account.xpubOrAddress,
    new Error('X0 derived a different address than the account'),
  );

  const recid = recoverRecid(digest, signature, publicKey);
  // tronweb ECKeySign convention: r || s || (27 + recid)
  const signatureHex =
    uint8ArrayToHex(derToCompact(signature)) +
    (27 + recid).toString(16).padStart(2, '0');

  return { ...txn, signature: [signatureHex] };
};
