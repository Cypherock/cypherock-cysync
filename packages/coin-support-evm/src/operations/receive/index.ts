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
import { evmCoinList } from '@cypherock/coins';
import { EvmApp, GetPublicKeysEvent } from '@cypherock/sdk-app-evm';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { IEvmReceiveEvent, IEvmReceiveParams, statusMap } from './types';

import { createApp } from '../../utils';
import { formatAddress } from '../formatAddress';

const getExternalAddress = async (
  params: IGenerateReceiveAddressParams,
): Promise<IReceiveAddressInfo> => {
  const { xpubOrAddress, derivationPath } = params.account;

  return {
    address: formatAddress({
      address: xpubOrAddress,
      coinId: params.account.parentAssetId,
    }),
    derivationPath,
    expectedFromDevice: xpubOrAddress,
  };
};

const getReceiveAddressFromDevice = async (
  params: IGetReceiveAddressFromDevice<EvmApp, IEvmReceiveEvent>,
): Promise<string> => {
  const { app, derivationPath, walletId, observer, account } = params;

  const events: Record<ReceiveDeviceEvent, boolean | undefined> = {} as any;

  const { address } = await app.getUserVerifiedPublicKey({
    walletId: hexToUint8Array(walletId),
    derivationPath: mapDerivationPath(derivationPath),
    chainId: evmCoinList[account.parentAssetId].chain,
    onEvent: (event: GetPublicKeysEvent) => {
      const receiveEvent = statusMap[event];
      if (receiveEvent !== undefined) events[receiveEvent] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });
  return formatAddress({ address, coinId: account.parentAssetId });
};

export const receive = (params: IEvmReceiveParams): Observable<IReceiveEvent> =>
  makeReceiveObservable({
    ...params,
    createApp,
    generateReceiveAddress: getExternalAddress,
    getReceiveAddressFromDevice,
  });
