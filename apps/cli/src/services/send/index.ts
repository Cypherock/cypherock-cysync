import { getCoinSupport } from '@cypherock/coin-support';
import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import {
  CoinSupport,
  IPreparedTransaction,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import {
  convertToUnit,
  getZeroUnit,
  getParsedAmount,
} from '@cypherock/coin-support-utils';
import { coinFamiliesMap, coinList, ICoinInfo } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import colors from 'colors/safe';
import { Observer, Subscription } from 'rxjs';

import {
  queryConfirm,
  queryInput,
  queryNumber,
  querySelect,
  Spinner,
} from '~/utils';

import { queryAccount, queryWallet } from '../helpers';

const preparingTxnSpinnerText = 'Preparing transaction';
const creatingTxnSpinnerText = 'Creating transaction';
const deviceSpinnerText = 'Signing transaction from device';
const broadcastSpinnerText = 'Signing transaction from device';

const getTxnInputs = async (params: {
  account: IAccount;
  coin: ICoinInfo;
  transaction: IPreparedTransaction;
}) => {
  const { account, coin, transaction } = params;
  const isBatchAllowed = coin.family === coinFamiliesMap.bitcoin;

  let outputCount = 1;

  if (isBatchAllowed) {
    const isBatch =
      (await querySelect([
        { name: 'Single Transaction', value: 'single' },
        { name: 'Batch transaction', value: 'batch' },
      ])) === 'batch';

    if (isBatch) {
      outputCount = await queryNumber('Enter the number of outputs');

      if (outputCount <= 0) {
        throw new Error('Invalid output count');
      }
    }
  }

  transaction.userInputs.outputs = [];

  for (let i = 0; i < outputCount; i += 1) {
    const address = await queryInput(
      `Enter address you want to transfer funds to (${i + 1})`,
    );
    const amountInDefaultUnit = await queryInput(
      `Enter amount you want to transfer in ${account.unit} (${i + 1})`,
    );
    const { amount } = convertToUnit({
      amount: amountInDefaultUnit,
      coinId: coin.id,
      fromUnitAbbr: account.unit,
      toUnitAbbr: getZeroUnit(coin.id).abbr,
    });
    transaction.userInputs.outputs.push({ address, amount });
  }

  if (coin.family === 'bitcoin') {
    const txn = transaction as IPreparedBtcTransaction;
    const feeRate = await queryNumber(
      `Enter the fee rate for the transaction (Average: ${txn.staticData.averageFee})`,
    );

    if (outputCount <= 0) {
      throw new Error('Invalid fees');
    }

    txn.userInputs.feeRate = feeRate;
  }
};

const showTransactionSummary = async (params: {
  account: IAccount;
  coin: ICoinInfo;
  transaction: IPreparedTransaction;
}) => {
  const { account, coin, transaction } = params;

  console.log(colors.cyan('Transaction summary'));

  let totalToDeduct = new BigNumber(0);
  let i = 1;
  for (const output of transaction.userInputs.outputs) {
    const { amount, unit } = getParsedAmount({
      coinId: coin.id,
      amount: output.amount,
      unitAbbr: account.unit,
    });

    console.log(
      `${i}. ${colors.grey(output.address)} (${colors.cyan(
        `${amount} ${unit.abbr})`,
      )}`,
    );
    totalToDeduct = totalToDeduct.plus(output.amount);
    i += 1;
  }

  if (coin.family === 'bitcoin') {
    const txn = transaction as IPreparedBtcTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: coin.id,
      amount: txn.computedData.fee,
      unitAbbr: account.unit,
    });
    console.log(`Transaction fees: ${colors.cyan(`${amount} ${unit.abbr}`)}`);
    totalToDeduct = totalToDeduct.plus(txn.computedData.fee);
  }

  const { amount, unit } = getParsedAmount({
    coinId: coin.id,
    amount: totalToDeduct.toString(),
    unitAbbr: account.unit,
  });
  console.log(`Total to deduct: ${colors.cyan(`${amount} ${unit.abbr}`)}`);
};

const showValidationErrors = (params: {
  account: IAccount;
  transaction: IPreparedTransaction;
}) => {
  const { account, transaction } = params;

  if (!transaction.validation.hasEnoughBalance) {
    console.log(
      colors.red(
        `You do not have enough balance in account ${account.name} to make this transaction`,
      ),
    );
    return false;
  }

  for (let i = 0; i < transaction.userInputs.outputs.length; i += 1) {
    const output = transaction.userInputs.outputs[i];
    if (!transaction.validation.outputs[i]) {
      console.log(
        colors.red(`Output address ${i + 1} is invalid: ${output.address}`),
      );
      return false;
    }
  }

  return true;
};

const verifyTransactionInput = async (params: {
  db: IDatabase;
  account: IAccount;
  coin: ICoinInfo;
  transaction: IPreparedTransaction;
  coinSupport: CoinSupport;
}) => {
  const { db, account, coinSupport, coin } = params;

  const spinner = await Spinner.create(preparingTxnSpinnerText);

  const transaction = await coinSupport.prepareTransaction({
    db,
    accountId: account.__id ?? '',
    txn: params.transaction,
  });

  spinner.succeed();

  const isValidated = showValidationErrors({
    account,
    transaction,
  });

  if (!isValidated) {
    console.log(colors.yellow('Transaction is invalid, please try again'));

    return {
      isConfirmed: false,
      transaction,
    };
  }

  showTransactionSummary({ account, coin, transaction });

  return {
    isConfirmed: await queryConfirm('Confirm transaction details'),
    transaction,
  };
};

const signTransaction = async (params: {
  db: IDatabase;
  connection: IDeviceConnection;
  transaction: IPreparedTransaction;
  coinSupport: CoinSupport;
}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<string>(async (resolve, reject) => {
    let subscription: Subscription | undefined;

    try {
      const { db, connection, transaction, coinSupport } = params;

      const deviceSpinner = await Spinner.create(deviceSpinnerText);

      let signedTransaction = '';

      const observer: Observer<ISignTransactionEvent> = {
        complete: () => {
          deviceSpinner.succeed();
          resolve(signedTransaction);
        },
        next: async value => {
          if (value.transaction) {
            signedTransaction = value.transaction;
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
        .signTransaction({
          connection,
          db,
          transaction,
        })
        .subscribe(observer);
    } catch (error) {
      if (subscription) {
        subscription.unsubscribe();
      }

      reject(error);
    }
  });

export const sendFunds = async (params: {
  db: IDatabase;
  connection: IDeviceConnection;
}) => {
  const { db, connection } = params;

  const wallet = await queryWallet(db, 'Select a wallet to send funds from');

  const account = await queryAccount(
    db,
    wallet.__id,
    'Select an account to send funds from',
  );

  const coin = coinList[account.assetId];
  const coinSupport = getCoinSupport(account.familyId);

  const spinner = await Spinner.create(creatingTxnSpinnerText);
  let transaction = await coinSupport.initializeTransaction({
    db,
    accountId: account.__id,
  });

  spinner.succeed();

  let isTransactionVerified = false;

  while (!isTransactionVerified) {
    await getTxnInputs({
      account,
      coin,
      transaction,
    });

    const result = await verifyTransactionInput({
      db,
      account,
      coin,
      transaction,
      coinSupport,
    });

    isTransactionVerified = result.isConfirmed;
    transaction = result.transaction;
  }

  const signedTransaction = await signTransaction({
    db,
    connection,
    transaction,
    coinSupport,
  });

  const broadcastSpinner = await Spinner.create(broadcastSpinnerText);

  const txn = await coinSupport.broadcastTransaction({
    db,
    signedTransaction,
    transaction,
  });

  broadcastSpinner.succeed();

  console.log(`Transaction hash: ${colors.grey(txn.hash)}`);
};
