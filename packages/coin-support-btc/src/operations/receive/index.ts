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
import { assert } from '@cypherock/cysync-utils';
import { BtcApp, GetPublicKeyStatus } from '@cypherock/sdk-app-btc';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { IBtcReceiveEvent, IBtcReceiveParams, statusMap } from './types';

import * as services from '../../services';

const getFirstUnusedExternalAddress = async (
  params: IGenerateReceiveAddressParams,
): Promise<IReceiveAddressInfo> => {
  const { account } = params;

  const result = await services.getDerivedAddresses({
    xpub: account.xpubOrAddress,
    coinId: account.assetId,
  });

  const unusedAddressInfo = result.tokens.filter(tokenItem => {
    const isUnused = tokenItem.transfers === 0;
    const isExternalAddress = tokenItem.path.split('/')[4] === '1';
    return isUnused && isExternalAddress;
  });

  assert(unusedAddressInfo.length > 0, 'No unused addresses found');

  const firstUnusedAddressInfo = unusedAddressInfo[0];

  return {
    address: firstUnusedAddressInfo.name,
    expectedFromDevice: firstUnusedAddressInfo.name,
    derivationPath: firstUnusedAddressInfo.path,
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
    onEvent: (event: GetPublicKeyStatus) => {
      const receiveStatus = statusMap[event];
      if (receiveStatus) events[receiveStatus] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return address;
};

const createApp = (connection: IDeviceConnection) => BtcApp.create(connection);

export const receive = (params: IBtcReceiveParams): Observable<IReceiveEvent> =>
  makeReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getFirstUnusedExternalAddress,
    getReceiveAddressFromDevice,
  });
