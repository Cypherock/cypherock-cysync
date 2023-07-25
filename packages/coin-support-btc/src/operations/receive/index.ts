import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import {
  ReceiveObservable,
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

import { IBtcReceiveEvent, IBtcReceiveParams } from './types';

import * as services from '../../services';

const getFirstUnusedExternalAddress = async (
  params: IGenerateReceiveAddressParams,
) => {
  const { db, accountId } = params;

  const account = await db.account.getOne({ __id: accountId });
  assert(account, 'Invalid AccountId');

  const result = await services.getDerivedAddresses({
    xpub: account.xpubOrAddress,
    coinId: account.assetId,
  });

  const firstUnusedAddressInfo = result.tokens.filter(tokenItem => {
    const isUnused = tokenItem.transfers === 0;
    const isExternalAddress = tokenItem.path.split('/')[4] === '1';
    return isUnused && isExternalAddress;
  })[0];

  return {
    address: firstUnusedAddressInfo.name,
    expectedFromDevice: firstUnusedAddressInfo.name,
    derivationPath: firstUnusedAddressInfo.path,
  } as IReceiveAddressInfo;
};

const getReceiveAddressFromDevice = async (
  params: IGetReceiveAddressFromDevice<BtcApp, IBtcReceiveEvent>,
) => {
  const { app, derivationPath, walletId, observer } = params;

  const events: Record<GetPublicKeyStatus, boolean | undefined> = {} as any;

  const { publicKey } = await app.getPublicKey({
    walletId: hexToUint8Array(walletId),
    derivationPath: mapDerivationPath(derivationPath),
    onEvent: (event: GetPublicKeyStatus) => {
      events[event] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return Buffer.from(publicKey).toString('hex');
};

const createApp = (connection: IDeviceConnection) => BtcApp.create(connection);

export const receive = (params: IBtcReceiveParams): Observable<IReceiveEvent> =>
  ReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getFirstUnusedExternalAddress,
    getReceiveAddressFromDevice,
  });
