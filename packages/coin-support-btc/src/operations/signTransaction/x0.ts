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
  verifySchnorrSignature,
  X0KeyMismatchError,
  X0_MAX_HASHES_PER_CALL,
  X0_MAX_SCHNORR_HASHES_PER_CALL,
} from '@cypherock/coin-support-utils';
import {
  addressToScriptPubKey,
  createSignedTransaction,
  getCoinTypeFromPath,
  getNetworkFromPath,
  getRawTxnHash,
  isScriptNestedSegwit,
  isScriptSegwit,
  isScriptTaproot,
  ISignTxnInputData,
  TAPROOT_PURPOSE,
} from '@cypherock/sdk-app-btc';
import { assert, uint8ArrayToHex } from '@cypherock/sdk-utils';

import { mapPreparedTxnToSdkTxn } from './map';

import { IPreparedBtcTransaction } from '../transaction';
import { parseAccountXpub } from '../../x0/accountXpub';
import { computeSighashes } from '../../x0/sighash';
import {
  toDeviceSignatureFormat,
  toTaprootDeviceSignatureFormat,
} from '../../x0/signatures';
import { getTaprootOutputKey } from '../../x0/taproot';

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
  const isTaproot = accountPath[0] === TAPROOT_PURPOSE;

  const txn = mapPreparedTxnToSdkTxn(transaction as IPreparedBtcTransaction);
  assert(txn.inputs.length > 0, new Error('Transaction has no inputs'));

  const network = getNetworkFromPath(accountPath);
  const { extendedKey, version } = parseAccountXpub(account.xpubOrAddress);
  const versions = { public: version, private: network.bip32.private };
  const accountPublicKey = deriveChildPublicKey(extendedKey, [], versions);

  // Leaf public keys come from host-side CKDpub over the stored account
  // xpub; the tap checks that xpub's key against the card before signing.
  const leafPublicKeys = txn.inputs.map(input =>
    deriveChildPublicKey(
      extendedKey,
      [input.changeIndex ?? 0, input.addressIndex ?? 0],
      versions,
    ),
  );

  // Legacy inputs commit to the full previous transaction.
  const inputs: ISignTxnInputData[] = JSON.parse(JSON.stringify(txn.inputs));
  for (const input of inputs) {
    const script = addressToScriptPubKey(input.address, accountPath);
    if (
      !isScriptSegwit(script) &&
      !isScriptNestedSegwit(script) &&
      !isScriptTaproot(script)
    ) {
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

  const cardSignatures: Uint8Array[] = new Array(inputs.length);
  const batchSize = isTaproot
    ? X0_MAX_SCHNORR_HASHES_PER_CALL
    : X0_MAX_HASHES_PER_CALL;

  await x0.runTap(
    async card => {
      const [cardAccountKey] = await card.deriveKeys({
        paths: [accountPath],
        format: 'xpub',
        xpub: { version: network.bip32.public },
      });
      if (
        uint8ArrayToHex(cardAccountKey.publicKey) !==
        uint8ArrayToHex(accountPublicKey)
      ) {
        throw new X0KeyMismatchError();
      }

      for (const group of groups) {
        for (const batch of chunkArray(group.items, batchSize)) {
          const results = await card.signHashes({
            path: group.path,
            hashes: batch.map(entry => entry.hash),
            scheme: isTaproot ? 'schnorr-bip340' : 'ecdsa-der',
          });
          batch.forEach((entry, i) => {
            cardSignatures[entry.index] = results[i].signature;
          });
        }
      }
    },
    { onEvent: emitter.onEvent },
  );

  emitter.markDone();

  entries.forEach(entry => {
    const signature = cardSignatures[entry.index];
    const leafPublicKey = leafPublicKeys[entry.index];
    assert(
      isTaproot
        ? verifySchnorrSignature(
            entry.hash,
            signature,
            getTaprootOutputKey(leafPublicKey),
          )
        : verifyDerSignature(entry.hash, signature, leafPublicKey),
      new Error('X0 signature verification failed'),
    );
  });

  const signatures = inputs.map((input, index) =>
    isTaproot
      ? toTaprootDeviceSignatureFormat(
          cardSignatures[index],
          leafPublicKeys[index],
        )
      : toDeviceSignatureFormat(cardSignatures[index], leafPublicKeys[index]),
  );

  return createSignedTransaction({
    inputs,
    outputs: txn.outputs,
    signatures,
    derivationPath: accountPath,
  });
};
