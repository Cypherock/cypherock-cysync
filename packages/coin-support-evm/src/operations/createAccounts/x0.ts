import {
  CreateAccountDeviceEvent,
  IX0DeriveKeyResult,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  chunkArray,
  createX0EventEmitter,
  GetAddressesFromX0,
  X0_MAX_DERIVE_PATHS_PER_CALL,
} from '@cypherock/coin-support-utils';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

import { derivationPathSchemes } from './schemes';
import { EvmDerivationSchemeName, IEvmDerivationScheme } from './schemes/types';

import { getCoinSupportEthersLib } from '../../utils';
import { formatAddress } from '../formatAddress';

/**
 * The `legacy` scheme (m/44'/60'/0'/i) is depth 4 — the X0 card can only
 * derive and sign at depth 5, so those accounts would be unspendable.
 */
export const x0DerivationPathSchemes: Record<
  EvmDerivationSchemeName,
  IEvmDerivationScheme | undefined
> = {
  ledger: derivationPathSchemes.ledger,
  metamask: derivationPathSchemes.metamask,
  legacy: undefined,
};

export const getAddressesFromX0: GetAddressesFromX0 = async params => {
  const { x0, coinId, derivationPaths, observer } = params;

  const emitter = createX0EventEmitter<CreateAccountDeviceEvent>(observer, {
    [X0FlowEvent.INIT]: CreateAccountDeviceEvent.INIT,
    [X0FlowEvent.CARD_CONNECTED]: CreateAccountDeviceEvent.CARD_TAPPED,
  });

  const results = await x0.runTap(
    async card => {
      const derived: IX0DeriveKeyResult[] = [];
      for (const batch of chunkArray(
        derivationPaths,
        X0_MAX_DERIVE_PATHS_PER_CALL,
      )) {
        derived.push(
          ...(await card.deriveKeys({
            paths: batch.map(d => d.derivationPath),
            format: 'raw-pubkey',
          })),
        );
      }
      return derived;
    },
    { onEvent: emitter.onEvent },
  );

  emitter.markDone();

  const ethers = getCoinSupportEthersLib();

  return results.map(result =>
    formatAddress({
      address: ethers.computeAddress(`0x${uint8ArrayToHex(result.publicKey)}`),
      coinId,
    }),
  );
};
