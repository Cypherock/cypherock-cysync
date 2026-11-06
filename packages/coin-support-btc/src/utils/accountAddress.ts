import {
  deriveChildPublicKey,
  mapDerivationPath,
} from '@cypherock/coin-support-utils';
import { IAccount } from '@cypherock/db-interfaces';
import {
  getBitcoinJsLib,
  getNetworkFromPath,
  getPurposeType,
} from '@cypherock/sdk-app-btc';
import { assert } from '@cypherock/sdk-utils';

import { parseAccountXpub } from '../x0/accountXpub';
import { toXOnlyPublicKey } from '../x0/taproot';

/**
 * The address at `change/index` under an account, computed from the stored
 * account xpub (CKDpub) in the address type of the account's purpose. Lets
 * callers check that an address the backend lists really belongs to the
 * account before showing it or sending change to it.
 */
export const deriveAccountAddress = (
  account: IAccount,
  change: number,
  index: number,
): string => {
  const accountPath = mapDerivationPath(account.derivationPath);
  const network = getNetworkFromPath(accountPath);
  const { extendedKey, version } = parseAccountXpub(account.xpubOrAddress);
  const pubkey = Buffer.from(
    deriveChildPublicKey(extendedKey, [change, index], {
      public: version,
      private: network.bip32.private,
    }),
  );

  const { payments } = getBitcoinJsLib();
  const purpose = getPurposeType(accountPath);
  let payment: { address?: string };
  if (purpose === 'taproot') {
    payment = payments.p2tr({
      internalPubkey: Buffer.from(toXOnlyPublicKey(pubkey)),
      network,
    });
  } else if (purpose === 'segwit') {
    payment = payments.p2wpkh({ pubkey, network });
  } else if (purpose === 'nested_segwit') {
    payment = payments.p2sh({
      redeem: payments.p2wpkh({ pubkey, network }),
      network,
    });
  } else {
    payment = payments.p2pkh({ pubkey, network });
  }

  assert(payment.address, 'Failed to derive account address');
  return payment.address;
};
