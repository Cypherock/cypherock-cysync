import {
  IReceiveEvent,
  ReceiveDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import {
  makeReceiveObservable,
  mapDerivationPath,
  IGenerateReceiveAddressParams,
  IReceiveAddressInfo,
  IGetReceiveAddressFromDevice,
} from '@cypherock/coin-support-utils';
import { BtcApp } from '@cypherock/sdk-app-btc';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { IBtcReceiveEvent, IBtcReceiveParams, statusMap } from './types';

import { getFirstUnusedAddress } from '../../services';
import { createApp } from '../../utils';

const getFirstUnusedExternalAddress = async (
  params: IGenerateReceiveAddressParams,
): Promise<IReceiveAddressInfo> => {
  const unusedAddress = await getFirstUnusedAddress(params.account, 'external');

  return {
    ...unusedAddress,
    expectedFromDevice: unusedAddress.address,
  };
};

const getReceiveAddressFromDevice = async (
  params: IGetReceiveAddressFromDevice<BtcApp, IBtcReceiveEvent>,
) => {
  const { app, derivationPath, walletId, observer } = params;

  const events: Record<ReceiveDeviceEvent, boolean | undefined> = {} as any;

  const { address } = await app.getPublicKey({
    walletId: hexToUint8Array(walletId),
    derivationPath: mapDerivationPath(derivationPath),
    onEvent: event => {
      const receiveEvent = statusMap[event];
      if (receiveEvent !== undefined) events[receiveEvent] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return address;
};

export const receive = (params: IBtcReceiveParams): Observable<IReceiveEvent> =>
  makeReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getFirstUnusedExternalAddress,
    getReceiveAddressFromDevice,
  });
