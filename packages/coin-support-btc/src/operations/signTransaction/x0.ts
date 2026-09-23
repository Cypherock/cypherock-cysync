import {
  SignTransactionDeviceEvent,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  chunkArray,
  createX0EventEmitter,
  deriveChildPublicKey,
  groupByLeafPath,
  mapDerivationPath,
  SignTransactionFromX0,
  verifyDerSignature,
  X0_MAX_HASHES_PER_CALL,
} from '@cypherock/coin-support-utils';
import {
  addressToScriptPubKey,
  createSignedTransaction,
  getCoinTypeFromPath,
  getNetworkFromPath,
  getRawTxnHash,
  isScriptNestedSegwit,
  isScriptSegwit,
  ISignTxnInputData,
  TAPROOT_PURPOSE,
} from '@cypherock/sdk-app-btc';
import { assert } from '@cypherock/sdk-utils';

import { mapPreparedTxnToSdkTxn } from './map';

import { IPreparedBtcTransaction } from '../transaction';
import { computeSighashes } from '../../x0/sighash';
import { toDeviceSignatureFormat } from '../../x0/signatures';

const ACCOUNT_PATH_DEPTH = 3;

export const signTransactionFromX0: SignTransactionFromX0<
  string
> = async params => {
  const { x0, observer, transaction, account } = params;

  const accountPath = mapDerivationPath(account.derivationPath);
  assert(
    accountPath.length === ACCOUNT_PATH_DEPTH,
    new Error('BTC account derivation path should be of depth 3'),
  );
  assert(
    accountPath[0] !== TAPROOT_PURPOSE,
    new Error('X0 cannot sign taproot transactions'),
  );

  const txn = mapPreparedTxnToSdkTxn(transaction as IPreparedBtcTransaction);
  assert(txn.inputs.length > 0, new Error('Transaction has no inputs'));

  const network = getNetworkFromPath(accountPath);
  const versions = {
    public: network.bip32.public,
    private: network.bip32.private,
  };

  // Leaf public keys come from host-side CKDpub over the account xpub —
  // no card round-trip needed for key material.
  const leafPublicKeys = txn.inputs.map(input =>
    deriveChildPublicKey(
      account.xpubOrAddress,
      [input.changeIndex ?? 0, input.addressIndex ?? 0],
      versions,
    ),
  );

  // Legacy inputs commit to the full previous transaction.
  const inputs: ISignTxnInputData[] = JSON.parse(JSON.stringify(txn.inputs));
  for (const input of inputs) {
    const script = addressToScriptPubKey(input.address, accountPath);
    if (!isScriptSegwit(script) && !isScriptNestedSegwit(script)) {
      input.prevTxn =
        input.prevTxn ??
        (await getRawTxnHash({
          hash: input.prevTxnId,
          coinType: getCoinTypeFromPath(accountPath),
        }));
    }
  }

  const sighashes = computeSighashes({
    inputs,
    outputs: txn.outputs,
    derivationPath: accountPath,
    leafPublicKeys,
  });

  const emitter = createX0EventEmitter<SignTransactionDeviceEvent>(observer, {
    [X0FlowEvent.INIT]: SignTransactionDeviceEvent.INIT,
    [X0FlowEvent.CARD_CONNECTED]: SignTransactionDeviceEvent.CARD_TAPPED,
  });

  const entries = inputs.map((input, index) => ({
    index,
    leafPath: [...accountPath, input.changeIndex ?? 0, input.addressIndex ?? 0],
    hash: sighashes[index],
  }));
  const groups = groupByLeafPath(entries, entry => entry.leafPath);

  const derSignatures: Uint8Array[] = new Array(inputs.length);

  await x0.runTap(
    async card => {
      for (const group of groups) {
        for (const batch of chunkArray(group.items, X0_MAX_HASHES_PER_CALL)) {
          const results = await card.signHashes({
            path: group.path,
            hashes: batch.map(entry => entry.hash),
          });
          batch.forEach((entry, i) => {
            derSignatures[entry.index] = results[i].signature;
          });
        }
      }
    },
    { onEvent: emitter.onEvent },
  );

  emitter.markDone();

  entries.forEach(entry => {
    assert(
      verifyDerSignature(
        entry.hash,
        derSignatures[entry.index],
        leafPublicKeys[entry.index],
      ),
      new Error('X0 signature verification failed'),
    );
  });

  const signatures = inputs.map((input, index) =>
    toDeviceSignatureFormat(derSignatures[index], leafPublicKeys[index]),
  );

  return createSignedTransaction({
    inputs,
    outputs: txn.outputs,
    signatures,
    derivationPath: accountPath,
  });
};
