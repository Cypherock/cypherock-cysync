import {
  IReceiveEvent,
  ReceiveDeviceEvent,
  X0FlowEvent,
} from '@cypherock/coin-support-interfaces';
import {
  createX0EventEmitter,
  IGetReceiveAddressFromX0,
  mapDerivationPath,
} from '@cypherock/coin-support-utils';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

import { getCoinSupportEthersLib } from '../../utils';
import { formatAddress } from '../formatAddress';

export const getReceiveAddressFromX0 = async (
  params: IGetReceiveAddressFromX0<IReceiveEvent>,
): Promise<string> => {
  const { x0, derivationPath, observer, account } = params;

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

  return formatAddress({
    address: getCoinSupportEthersLib().computeAddress(
      `0x${uint8ArrayToHex(result.publicKey)}`,
    ),
    coinId: account.parentAssetId,
  });
};
