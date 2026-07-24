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

/**
 * XRP accounts store the compressed public key hex in xpubOrAddress; the
 * address is derived host-side via xrpl.deriveAddress — same as the X1 flow.
 */
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

  return results.map(result => uint8ArrayToHex(result.publicKey));
};
