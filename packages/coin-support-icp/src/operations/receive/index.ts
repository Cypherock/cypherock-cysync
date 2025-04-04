import {
  makeReceiveObservable,
  IGenerateReceiveAddressParams,
  IReceiveAddressInfo,
  IGetReceiveAddressFromDevice,
  mapDerivationPath,
} from '@cypherock/coin-support-utils';
import { IcpApp, GetPublicKeysEvent } from '@cypherock/sdk-app-icp';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  IcpReceiveDeviceEvent,
  IIcpReceiveEvent,
  IIcpReceiveParams,
  statusMap,
} from './types';

import { createApp, deriveAddress } from '../../utils';
import { IIcpAccount } from '../types';

export const getExternalAddress = async (
  params: IGenerateReceiveAddressParams,
): Promise<IReceiveAddressInfo> => {
  const {
    xpubOrAddress,
    derivationPath,
    extraData: { publicKey },
  } = params.account as IIcpAccount;

  return {
    address: publicKey,
    derivationPath,
    expectedFromDevice: xpubOrAddress,
  };
};

const getReceiveAddressFromDevice = async (
  params: IGetReceiveAddressFromDevice<IcpApp, IIcpReceiveEvent>,
): Promise<string> => {
  const { app, derivationPath, walletId, observer } = params;

  const events: Record<IcpReceiveDeviceEvent, boolean | undefined> = {} as any;

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
  return deriveAddress(publicKey);
};

export const receive = (
  params: IIcpReceiveParams,
): Observable<IIcpReceiveEvent> =>
  makeReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getExternalAddress,
    getReceiveAddressFromDevice,
  });
