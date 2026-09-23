import { compressPublicKey } from '@cypherock/coin-support-utils';
import {
  addressToScriptPubKey,
  getBitcoinJsLib,
  getNetworkFromPath,
  isScriptNestedSegwit,
  isScriptSegwit,
  ISignTxnInputData,
  ISignTxnOutputData,
} from '@cypherock/sdk-app-btc';
import { assert } from '@cypherock/sdk-utils';

/**
 * Computes the exact digest each input's signature must commit to (legacy
 * sighash or BIP143 for segwit v0) by building the same Psbt that
 * createSignedTransaction builds and capturing the hash bitcoinjs hands to
 * the Signer. The Psbt is discarded; only the hashes are kept.
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

  for (let i = 0; i < inputs.length; i += 1) {
    const input = inputs[i];
    const script = addressToScriptPubKey(input.address, derivationPath);

    const isNestedSegwit = isScriptNestedSegwit(script);
    const isSegwit = isScriptSegwit(script) || isNestedSegwit;

    const txnInput: any = {
      hash: input.prevTxnId,
      index: input.prevIndex,
    };

    if (isSegwit) {
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
    const captureSigner = {
      publicKey: Buffer.from(compressPublicKey(leafPublicKeys[i])),
      sign: (hash: Buffer) => {
        hashes[i] = Uint8Array.from(hash);
        return Buffer.alloc(64);
      },
    };
    psbt.signInput(i, captureSigner);
  }

  assert(
    hashes.every(hash => hash?.length === 32),
    'Failed to compute sighashes for all inputs',
  );

  return hashes;
};
