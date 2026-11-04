import { compressPublicKey } from '@cypherock/coin-support-utils';
import {
  addressToScriptPubKey,
  getBitcoinJsLib,
  getNetworkFromPath,
  isScriptNestedSegwit,
  isScriptSegwit,
  isScriptTaproot,
  ISignTxnInputData,
  ISignTxnOutputData,
} from '@cypherock/sdk-app-btc';
import { assert } from '@cypherock/sdk-utils';

import { getTaprootOutputKey, toXOnlyPublicKey } from './taproot';

/**
 * Computes the exact digest each input's signature must commit to (legacy
 * sighash, BIP143 for segwit v0, or BIP341 key-path for taproot) by building
 * the same Psbt that createSignedTransaction builds and capturing the hash
 * bitcoinjs hands to the Signer. The Psbt is discarded; only the hashes are
 * kept. bitcoinjs only yields a taproot key-path hash when the signer key
 * equals the output key in the input's scriptPubKey, so this also checks the
 * host-side tweak against the address.
 */
export const computeSighashes = (params: {
  inputs: ISignTxnInputData[];
  outputs: ISignTxnOutputData[];
  derivationPath: number[];
  leafPublicKeys: Uint8Array[];
}): Uint8Array[] => {
  const { inputs, outputs, derivationPath, leafPublicKeys } = params;

  const bitcoinjs = getBitcoinJsLib();
  const network = getNetworkFromPath(derivationPath);
  const psbt = new bitcoinjs.Psbt({ network });
  const isTaprootInput: boolean[] = [];

  for (let i = 0; i < inputs.length; i += 1) {
    const input = inputs[i];
    const script = addressToScriptPubKey(input.address, derivationPath);

    const isNestedSegwit = isScriptNestedSegwit(script);
    const isSegwit = isScriptSegwit(script) || isNestedSegwit;
    const isTaproot = isScriptTaproot(script);
    isTaprootInput.push(isTaproot);

    const txnInput: any = {
      hash: input.prevTxnId,
      index: input.prevIndex,
    };

    if (isSegwit || isTaproot) {
      txnInput.witnessUtxo = {
        script: Buffer.from(script, 'hex'),
        value: parseInt(input.value, 10),
      };
      if (isNestedSegwit) {
        txnInput.redeemScript = bitcoinjs.payments.p2wpkh({
          pubkey: Buffer.from(compressPublicKey(leafPublicKeys[i])),
          network,
        }).output;
      }
      if (isTaproot) {
        txnInput.tapInternalKey = Buffer.from(
          toXOnlyPublicKey(leafPublicKeys[i]),
        );
      }
    } else {
      assert(input.prevTxn, 'prevTxn is required in input');
      txnInput.nonWitnessUtxo = Buffer.from(input.prevTxn as string, 'hex');
    }

    psbt.addInput(txnInput);
  }

  for (const output of outputs) {
    psbt.addOutput({
      address: output.address,
      value: parseInt(output.value, 10),
    });
  }

  const hashes: Uint8Array[] = new Array(inputs.length);

  for (let i = 0; i < inputs.length; i += 1) {
    const capture = (hash: Buffer) => {
      hashes[i] = Uint8Array.from(hash);
      return Buffer.alloc(64);
    };

    if (isTaprootInput[i]) {
      psbt.signTaprootInput(i, {
        publicKey: Buffer.from(getTaprootOutputKey(leafPublicKeys[i])),
        sign: capture,
        signSchnorr: capture,
      });
    } else {
      psbt.signInput(i, {
        publicKey: Buffer.from(compressPublicKey(leafPublicKeys[i])),
        sign: capture,
      });
    }
  }

  assert(
    hashes.every(hash => hash?.length === 32),
    'Failed to compute sighashes for all inputs',
  );

  return hashes;
};
