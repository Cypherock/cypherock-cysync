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
import {
  StarknetApp,
  GetPublicKeysEvent,
  getAddressFromPublicKey,
} from '@cypherock/sdk-app-starknet';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  IStarknetReceiveEvent,
  IStarknetReceiveParams,
  statusMap,
} from './types';

import { createApp } from '../../utils';
import { getStarknetApiJs } from '@cypherock/sdk-app-starknet/dist/utils';

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
  params: IGetReceiveAddressFromDevice<StarknetApp, IStarknetReceiveEvent>,
): Promise<string> => {
  const { app, derivationPath, walletId, observer } = params;

  const events: Record<ReceiveDeviceEvent, boolean | undefined> = {} as any;

  // TODO: Change to user verified key fetching
  const { publicKeys } = await app.getPublicKeys({
    walletId: hexToUint8Array(walletId),
    derivationPaths: [{ path: mapDerivationPath(derivationPath) }],
    onEvent: (event: GetPublicKeysEvent) => {
      const receiveEvent = statusMap[event];
      if (receiveEvent !== undefined) events[receiveEvent] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });
  return getAddressFromPublicKey(
    getStarknetApiJs().ec.starkCurve.getStarkKey(publicKeys[0].slice(0, 64)),
  );
};

export const receive = (
  params: IStarknetReceiveParams,
): Observable<IReceiveEvent> =>
  makeReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getExternalAddress,
    getReceiveAddressFromDevice,
  });
