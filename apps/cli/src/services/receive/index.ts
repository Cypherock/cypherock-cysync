import { getCoinSupport } from '@cypherock/coin-support';
import {
  IReceiveEvent,
  ReceiveDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount, IDatabase, IWallet } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import colors from 'colors/safe';
import { Subscription, Observer } from 'rxjs';

import { createConnection, Spinner } from '~/utils';

import { queryAccount, queryWallet } from '../helpers';

const verifiedAddressSpinnerText = 'Getting address from device';
const unverifiedAddressSpinnerText = 'Generating address';

const getReceiveAddress = async (params: {
  db: IDatabase;
  connection?: IDeviceConnection;
  wallet: IWallet;
  account: IAccount;
}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<string>(async (resolve, reject) => {
    let subscription: Subscription | undefined;

    try {
      const { db, connection, account, wallet } = params;

      const coinSupport = getCoinSupport(account.familyId);
      let address = '';

      const isGeneratingVerified = !!connection;

      const spinner = await Spinner.create(
        isGeneratingVerified
          ? verifiedAddressSpinnerText
          : unverifiedAddressSpinnerText,
      );

      const observer: Observer<IReceiveEvent> = {
        complete: () => {
          spinner.succeed();
          resolve(address);
        },
        next: async value => {
          if (value.device) {
            let actionText = '';
            if (value.device.events[ReceiveDeviceEvent.INIT]) {
              actionText = 'Confirm on device';
            }

            if (
              wallet.hasPassphrase &&
              value.device.events[ReceiveDeviceEvent.CONFIRMED]
            ) {
              actionText = 'Enter passphrase';
            }

            if (value.device.events[ReceiveDeviceEvent.PASSPHRASE_ENTERED]) {
              if (wallet.hasPin) {
                actionText = 'Enter pin and tap card';
              } else {
                actionText = 'Tap card';
              }
            }

            if (value.device.events[ReceiveDeviceEvent.CARD_TAPPED]) {
              actionText = 'Verify address on device';
            }

            if (value.device.events[ReceiveDeviceEvent.VERIFIED]) {
              actionText = 'Processing';
            }

            spinner.updateText(`${verifiedAddressSpinnerText} (${actionText})`);
          }

          if (value.address) {
            console.log(`\nUnverified address: ${colors.cyan(value.address)}`);
            address = value.address;
          }
        },
        error: error => {
          if (!spinner.isCompleted) {
            spinner.fail();
          }

          reject(error);
        },
      };

      subscription = coinSupport
        .receive({
          accountId: account.__id ?? '',
          connection,
          db,
        })
        .subscribe(observer);
    } catch (error) {
      if (subscription) {
        subscription.unsubscribe();
      }

      reject(error);
    }
  });

export const receiveFunds = async (params: { db: IDatabase }) => {
  const { db } = params;

  const selectedWallet = await queryWallet(
    db,
    'Select a wallet to receive funds in',
  );

  const selectedAccount = await queryAccount(
    db,
    selectedWallet.__id,
    'Select an account to receive funds in',
  );

  if (!selectedAccount) {
    throw new Error('No account selected');
  }

  let connection: IDeviceConnection | undefined;

  try {
    connection = await createConnection();
  } catch (error) {
    console.log(
      colors.yellow('No device connected, generating unverified address'),
    );
  }

  const address = await getReceiveAddress({
    db,
    connection,
    account: selectedAccount,
    wallet: selectedWallet,
  });

  if (connection) {
    console.log(`\nVerified address: ${colors.cyan(address)}`);
  }
};
