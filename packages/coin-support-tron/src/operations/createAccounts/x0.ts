import {
  CreateAccountDeviceEvent,
  IX0DeriveKeyResult,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  chunkArray,
  createX0EventEmitter,
  decompressPublicKey,
  GetAddressesFromX0,
  X0_MAX_DERIVE_PATHS_PER_CALL,
} from '@cypherock/coin-support-utils';
import { getAddressFromPublicKey } from '@cypherock/sdk-app-tron';

import { derivationPathSchemes } from './schemes';
import {
  ITronDerivationScheme,
  TronDerivationSchemeName,
} from './schemes/types';

/**
 * Keep NFC taps short: derive fewer upfront candidates per scheme than the
 * X1 flow. The 2-empty-account threshold usually stops within this window.
 */
export const X0_DERIVATION_PATH_LIMIT = 5;

/**
 * The `atomic` scheme (m/44'/195'/0') is depth 3 — the X0 card can only
 * derive and sign at depth 5, so those accounts would be unspendable.
 */
export const x0DerivationPathSchemes: Record<
  TronDerivationSchemeName,
  ITronDerivationScheme | undefined
> = {
  tronlink: derivationPathSchemes.tronlink,
  atomic: undefined,
};

export const getAddressesFromX0: GetAddressesFromX0 = async params => {
  const { x0, derivationPaths, observer } = params;

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

  // tronweb's computeAddress expects an uncompressed public key
  return results.map(result =>
    getAddressFromPublicKey(decompressPublicKey(result.publicKey)),
  );
};
