import {
  IReceiveEvent,
  ReceiveDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import {
  makeReceiveObservable,
  IGenerateReceiveAddressParams,
  IReceiveAddressInfo,
  IGetReceiveAddressFromDevice,
  mapDerivationPath,
} from '@cypherock/coin-support-utils';
import { CantonApp, GetPublicKeysEvent } from '@cypherock/sdk-app-canton';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { ICantonReceiveEvent, ICantonReceiveParams, statusMap } from './types';

import { createApp } from '../../utils';

export const getExternalAddress = async (
  params: IGenerateReceiveAddressParams,
): Promise<IReceiveAddressInfo> => {
  const { xpubOrAddress, derivationPath } = params.account;

  return {
    address: xpubOrAddress,
    derivationPath,
    expectedFromDevice: xpubOrAddress,
  };
};

const getReceiveAddressFromDevice = async (
  params: IGetReceiveAddressFromDevice<CantonApp, ICantonReceiveEvent>,
): Promise<string> => {
  const { app, derivationPath, walletId, observer } = params;

  const events: Record<ReceiveDeviceEvent, boolean | undefined> = {} as any;

  const { partyId } = await app.getUserVerifiedPublicKey({
    walletId: hexToUint8Array(walletId),
    derivationPath: mapDerivationPath(derivationPath),
    onEvent: (event: GetPublicKeysEvent) => {
      const receiveEvent = statusMap[event];
      if (receiveEvent !== undefined) events[receiveEvent] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });
  return partyId;
};

export const receive = (
  params: ICantonReceiveParams,
): Observable<IReceiveEvent> =>
  makeReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getExternalAddress,
    getReceiveAddressFromDevice,
  });
