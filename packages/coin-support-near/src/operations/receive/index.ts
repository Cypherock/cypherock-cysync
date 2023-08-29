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
import { NearApp, GetPublicKeysEvent } from '@cypherock/sdk-app-near';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { INearReceiveEvent, INearReceiveParams, statusMap } from './types';

import { createApp } from '../../utils';

const getExternalAddress = async (
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
  params: IGetReceiveAddressFromDevice<NearApp, INearReceiveEvent>,
): Promise<string> => {
  const { app, derivationPath, walletId, observer } = params;

  const events: Record<ReceiveDeviceEvent, boolean | undefined> = {} as any;

  const { publicKey } = await app.getUserVerifiedPublicKey({
    walletId: hexToUint8Array(walletId),
    derivationPath: mapDerivationPath(derivationPath),
    onEvent: (event: GetPublicKeysEvent) => {
      const receiveEvent = statusMap[event];
      if (receiveEvent !== undefined) events[receiveEvent] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });
  return publicKey;
};

export const receive = (
  params: INearReceiveParams,
): Observable<IReceiveEvent> =>
  makeReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getExternalAddress,
    getReceiveAddressFromDevice,
  });
