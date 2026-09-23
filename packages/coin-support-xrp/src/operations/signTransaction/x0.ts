import {
  SignTransactionDeviceEvent,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  createX0EventEmitter,
  mapDerivationPath,
  sha512Half,
  SignTransactionFromX0,
  verifyDerSignature,
} from '@cypherock/coin-support-utils';
import { IXrpCoinInfo } from '@cypherock/coins';
import { assert, hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';

import { prepareUnsignedTxn } from './unsigned';

import { getCoinSupportXrpLib } from '../../utils';
import { IPreparedXrpTransaction } from '../transaction';

const X0_LEAF_DEPTH = 5;

export const signTransactionFromX0: SignTransactionFromX0<
  string
> = async params => {
  const { x0, observer, transaction, account, coin } = params;

  const derivationPath = mapDerivationPath(account.derivationPath);
  assert(
    derivationPath.length === X0_LEAF_DEPTH,
    new Error('X0 can only sign for depth-5 derivation paths'),
  );

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedXrpTransaction,
    coin as IXrpCoinInfo,
    account,
  );

  // XRPL signs sha512half over the serialized signing fields, which
  // encodeForSigning has already prefixed with the STX marker.
  const digest = sha512Half(hexToUint8Array(txn.txnHex));

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
  assert(
    uint8ArrayToHex(publicKey).toLowerCase() ===
      account.xpubOrAddress.toLowerCase(),
    new Error('X0 derived a different public key than the account'),
  );

  // XRPL requires canonical low-S DER signatures — the card guarantees low-S.
  const serializedTxn = getCoinSupportXrpLib().encode({
    ...txn.rawTxn,
    TxnSignature: uint8ArrayToHex(signature),
  });

  assert(serializedTxn, new Error('Failed to sign transaction'));

  return serializedTxn;
};
