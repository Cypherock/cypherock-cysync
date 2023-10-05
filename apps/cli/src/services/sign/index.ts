import { getCoinSupport } from '@cypherock/coin-support';
import {
  CoinSupport,
  ISignMessageEvent,
  ISignMessageParamsPayload,
  SignMessageType,
} from '@cypherock/coin-support-interfaces';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import colors from 'colors/safe';
import { Observer, Subscription } from 'rxjs';

import { queryInput, querySelect, Spinner } from '~/utils';

import { queryAccount, queryWallet } from '../helpers';

const deviceSpinnerText = 'Signing message from device';

const sign = async (params: {
  db: IDatabase;
  connection: IDeviceConnection;
  coinSupport: CoinSupport;
  account: IAccount;
  payload: ISignMessageParamsPayload;
}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<string>(async (resolve, reject) => {
    let subscription: Subscription | undefined;

    try {
      const { db, connection, payload, coinSupport, account } = params;

      const deviceSpinner = await Spinner.create(deviceSpinnerText);

      let signedMessage = '';

      const observer: Observer<ISignMessageEvent> = {
        complete: () => {
          deviceSpinner.succeed();
          resolve(signedMessage);
        },
        next: async value => {
          if (value.signature) {
            signedMessage = value.signature;
          }
        },
        error: error => {
          if (!deviceSpinner.isCompleted) {
            deviceSpinner.fail();
          }

          reject(error);
        },
      };

      subscription = coinSupport
        .signMessage({
          connection,
          db,
          account,
          payload,
        })
        .subscribe(observer);
    } catch (error) {
      if (subscription) {
        subscription.unsubscribe();
      }

      reject(error);
    }
  });

export const signMessage = async (params: {
  db: IDatabase;
  connection: IDeviceConnection;
}) => {
  const { db, connection } = params;

  const wallet = await queryWallet(db, 'Select a wallet to send funds from');

  const account = await queryAccount(
    db,
    wallet.__id,
    'Select an account to sign message from',
  );
  if (account.familyId !== 'evm') {
    console.log(
      colors.yellow('Sign message is only available for evm family.'),
    );
    return;
  }
  const signingTypeData = [
    { name: 'Eth Message', value: SignMessageType.ETH_MESSAGE },
    { name: 'Private Message', value: SignMessageType.PRIVATE_MESSAGE },
    { name: 'Typed Message', value: SignMessageType.TYPED_MESSAGE },
  ];

  const data = await querySelect(signingTypeData, 'Select Signing type');
  const message = await queryInput(
    data === SignMessageType.TYPED_MESSAGE
      ? 'Enter String encoded json data:'
      : 'Enter hex encoded string data:',
  );
  const coinSupport = getCoinSupport(account.familyId);
  const signaturePayload: ISignMessageParamsPayload = {
    message,
    signingType: data,
  };
  const signature = await sign({
    db,
    connection,
    coinSupport,
    account,
    payload: signaturePayload,
  });
  console.log(`Message Signature: ${colors.green(signature)}`);
};
