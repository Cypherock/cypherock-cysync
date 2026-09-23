import {
  CreateAccountDeviceEvent,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  chunkArray,
  createX0EventEmitter,
  GetAddressesFromX0,
  X0_MAX_DERIVE_PATHS_PER_CALL,
} from '@cypherock/coin-support-utils';
import { getNetworkFromPath } from '@cypherock/sdk-app-btc';

import { createDerivationPathSchemes } from './schemes';

/**
 * Keep NFC taps short: derive fewer upfront candidates per scheme than the
 * X1 flow. The 2-empty-account threshold usually stops within this window.
 */
export const X0_DERIVATION_PATH_LIMIT = 5;

/**
 * Taproot requires schnorr signatures, which the X0 card cannot produce —
 * exclude the scheme so X0 never creates accounts it cannot sign for.
 */
export const createX0DerivationPathSchemes = (assetId: string) => ({
  ...createDerivationPathSchemes(assetId),
  taproot: undefined,
});

export const getAddressesFromX0: GetAddressesFromX0 = async params => {
  const { x0, derivationPaths, observer } = params;

  const emitter = createX0EventEmitter<CreateAccountDeviceEvent>(observer, {
    [X0FlowEvent.INIT]: CreateAccountDeviceEvent.INIT,
    [X0FlowEvent.CARD_CONNECTED]: CreateAccountDeviceEvent.CARD_TAPPED,
  });

  // Same account-level (depth 3) paths as X1 getXpubs. The xpub version word
  // is per-network, identical for every path in one flow.
  const xpubVersion = getNetworkFromPath(derivationPaths[0].derivationPath)
    .bip32.public;

  const xpubs = await x0.runTap(
    async card => {
      const derived: string[] = [];
      for (const batch of chunkArray(
        derivationPaths,
        X0_MAX_DERIVE_PATHS_PER_CALL,
      )) {
        const results = await card.deriveKeys({
          paths: batch.map(d => d.derivationPath),
          format: 'xpub',
          xpub: { version: xpubVersion },
        });
        for (const result of results) {
          if (!result.xpub) throw new Error('Card did not return an xpub');
          derived.push(result.xpub);
        }
      }
      return derived;
    },
    { onEvent: emitter.onEvent },
  );

  emitter.markDone();

  return xpubs;
};
