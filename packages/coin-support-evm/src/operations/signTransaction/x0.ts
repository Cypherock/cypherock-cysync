import {
  SignTransactionDeviceEvent,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  createX0EventEmitter,
  derToRS,
  mapDerivationPath,
  recoverRecid,
  SignTransactionFromX0,
  verifyDerSignature,
} from '@cypherock/coin-support-utils';
import { IEvmCoinInfo } from '@cypherock/coins';
import { assert, uint8ArrayToHex } from '@cypherock/sdk-utils';

import { prepareUnsignedTxn } from './unsigned';

import { getCoinSupportEthersLib } from '../../utils';
import { IPreparedEvmTransaction } from '../transaction';

const X0_LEAF_DEPTH = 5;

export const signTransactionFromX0: SignTransactionFromX0<
  string
> = async params => {
  const { x0, observer, transaction, account, coin } = params;

  const ethers = getCoinSupportEthersLib();
  const derivationPath = mapDerivationPath(account.derivationPath);
  assert(
    derivationPath.length === X0_LEAF_DEPTH,
    new Error('X0 can only sign for depth-5 derivation paths'),
  );

  const unsignedSerialized = await prepareUnsignedTxn(
    transaction as IPreparedEvmTransaction,
    coin as IEvmCoinInfo,
    account,
  );
  const txn = ethers.Transaction.from(unsignedSerialized);
  const digest = ethers.getBytes(txn.unsignedHash);

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

  const derivedAddress = ethers.computeAddress(
    `0x${uint8ArrayToHex(publicKey)}`,
  );
  assert(
    derivedAddress.toLowerCase() === account.xpubOrAddress.toLowerCase(),
    new Error('X0 derived a different address than the account'),
  );

  const { r, s } = derToRS(signature);
  const recid = recoverRecid(digest, signature, publicKey);

  txn.signature = ethers.Signature.from({
    r: `0x${uint8ArrayToHex(r)}`,
    s: `0x${uint8ArrayToHex(s)}`,
    v: 27 + recid,
  });

  return txn.serialized;
};
