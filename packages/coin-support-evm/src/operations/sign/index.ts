import {
  ISignMessageEvent,
  ISignMessageParams,
  SignMessageDeviceEvent,
  SignMessageType,
} from '@cypherock/coin-support-interfaces';
import {
  mapDerivationPath,
  makeSignMessageObservable,
  ISignMessageFromDeviceParams,
} from '@cypherock/coin-support-utils';
import { EvmApp, ISignMsgResult, SignMsgEvent } from '@cypherock/sdk-app-evm';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { statusMap } from './types';

import { createApp } from '../../utils';

const signMessageFromDevice = async (
  params: ISignMessageFromDeviceParams<EvmApp>,
): Promise<string> => {
  const { app, observer, account, payload } = params;
  const events: Record<SignMessageDeviceEvent, boolean | undefined> = {} as any;

  const signingPayload = {
    message: payload.message,
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    onEvent: (event: SignMsgEvent) => {
      const signEvent = statusMap[event];
      if (signEvent !== undefined) events[signEvent] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  };
  let result: ISignMsgResult;
  switch (payload.signingType) {
    case SignMessageType.ETH_MESSAGE:
      result = await app.signEthMsg(signingPayload);
      break;
    case SignMessageType.PRIVATE_MESSAGE:
      result = await app.signPersonalMsg(signingPayload);
      break;
    case SignMessageType.TYPED_MESSAGE:
      result = await app.signTypedMsg({
        ...signingPayload,
        message: JSON.parse(payload.message),
      });
      break;
    default:
      throw Error(`invalid signing type ${payload.signingType}`);
  }

  observer.next({ type: 'Device', device: { isDone: true, events } });
  return result.serializedSignature;
};

export const sign = (
  params: ISignMessageParams,
): Observable<ISignMessageEvent> =>
  makeSignMessageObservable({
    ...params,
    createApp,
    signMessageFromDevice,
  });
