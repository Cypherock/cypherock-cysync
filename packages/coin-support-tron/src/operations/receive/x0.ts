import {
  IReceiveEvent,
  ReceiveDeviceEvent,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  createX0EventEmitter,
  decompressPublicKey,
  IGetReceiveAddressFromX0,
  mapDerivationPath,
} from '@cypherock/coin-support-utils';
import { getAddressFromPublicKey } from '@cypherock/sdk-app-tron';

export const getReceiveAddressFromX0 = async (
  params: IGetReceiveAddressFromX0<IReceiveEvent>,
): Promise<string> => {
  const { x0, derivationPath, observer } = params;

  const emitter = createX0EventEmitter<ReceiveDeviceEvent>(observer, {
    [X0FlowEvent.INIT]: ReceiveDeviceEvent.INIT,
    [X0FlowEvent.CARD_CONNECTED]: ReceiveDeviceEvent.CARD_TAPPED,
    [X0FlowEvent.PIN_VERIFIED]: ReceiveDeviceEvent.VERIFIED,
  });

  const [result] = await x0.runTap(
    card =>
      card.deriveKeys({
        paths: [mapDerivationPath(derivationPath)],
        format: 'raw-pubkey',
      }),
    { onEvent: emitter.onEvent },
  );

  emitter.markDone();

  return getAddressFromPublicKey(decompressPublicKey(result.publicKey));
};
