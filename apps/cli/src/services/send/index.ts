import { getCoinSupport } from '@cypherock/coin-support';
import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import {
  CoinSupport,
  IPreparedTransaction,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import { IPreparedSolanaTransaction } from '@cypherock/coin-support-solana';
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
import { IPreparedStarknetTransaction } from '@cypherock/coin-support-starknet';

const preparingTxnSpinnerText = 'Preparing transaction';
const creatingTxnSpinnerText = 'Creating transaction';
const deviceSpinnerText = 'Signing transaction from device';
const broadcastSpinnerText = 'Broadcasting transaction';

const getTxnInputs = async (params: {
  account: IAccount;
  coin: ICoinInfo;
  transaction: IPreparedTransaction;
}) => {
  const { account, coin, transaction } = params;
  const isBatchAllowed = coin.family === coinFamiliesMap.bitcoin;

  let outputCount = 1;

  const transactionTypeChoices = [
    { name: 'Deploy account', value: 'deploy' },
    { name: 'Single Transaction', value: 'single' },
    { name: 'Send all transaction', value: 'all' },
  ];

  if (isBatchAllowed) {
    transactionTypeChoices.push({ name: 'Batch transaction', value: 'batch' });
  }

  const transactionType = await querySelect(transactionTypeChoices);

  if (isBatchAllowed) {
    const isBatch = transactionType === 'batch';

    if (isBatch) {
      outputCount = await queryNumber('Enter the number of outputs');

      if (outputCount <= 0) {
        throw new Error('Invalid output count');
      }
    }
  }

  if (transactionType === 'all') {
    outputCount = 1;
    transaction.userInputs.isSendAll = true;
  } else if (transactionType === 'deploy') {
    outputCount = 0;
    transaction.userInputs.isSendAll = false;
  } else {
    transaction.userInputs.isSendAll = false;
  }

  transaction.userInputs.outputs = [];

  for (let i = 0; i < outputCount; i += 1) {
    const address = await queryInput(
      `Enter address you want to transfer funds to (${i + 1})`,
    );
    let amount = '';

    const unit =
      account.unit ?? getZeroUnit(account.parentAssetId, account.assetId).abbr;
    if (!transaction.userInputs.isSendAll) {
      const amountInDefaultUnit = await queryInput(
        `Enter amount you want to transfer in ${unit} (${i + 1})`,
      );
      const convertedAmount = convertToUnit({
        amount: amountInDefaultUnit,
        coinId: coin.id,
        fromUnitAbbr: unit,
        toUnitAbbr: getZeroUnit(coin.id).abbr,
      });
      amount = convertedAmount.amount;
    }

    transaction.userInputs.outputs.push({ address, amount });
  }

  if (coin.family === coinFamiliesMap.bitcoin) {
    const txn = transaction as IPreparedBtcTransaction;
    const feeRate = await queryNumber(
      `Enter the fee rate for the transaction (Average: ${txn.staticData.averageFee})`,
    );

    if (outputCount <= 0) {
      throw new Error('Invalid fees');
    }

    txn.userInputs.feeRate = feeRate;
  }

  if (coin.family === coinFamiliesMap.evm) {
    const txn = transaction as IPreparedEvmTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: coin.id,
      amount: txn.staticData.averageGasPrice,
      unitAbbr: 'Gwei',
    });
    const gasPrice = await queryInput(
      `Enter the gas price for the transaction (Average: ${amount} ${unit.abbr})`,
    );
    const gasLimit = await queryInput(
      `Enter the gas limit for the transaction`,
    );

    if (outputCount <= 0) {
      throw new Error('Invalid fees');
    }

    txn.userInputs.gasLimit = gasLimit;
    txn.userInputs.gasPrice = convertToUnit({
      amount: gasPrice,
      coinId: coin.id,
      fromUnitAbbr: `Gwei`,
      toUnitAbbr: getZeroUnit(coin.id).abbr,
    }).amount;
  }

  if (coin.family === coinFamiliesMap.starknet) {
    const txn = transaction as IPreparedStarknetTransaction;
    txn.userInputs.txnType = transactionType !== 'deploy' ? 'transfer' : 'deploy';
    if (txn.userInputs.txnType !== 'deploy') {
      const { amount, unit } = getParsedAmount({
        coinId: coin.id,
        amount: txn.staticData.maxFee,
        unitAbbr: 'ETH',
      });
      const fee = await queryInput(
        `Enter the fee for the transaction (Suggested: ${amount} ${unit.abbr})`,
      );

      if (transactionType !== 'deploy' && outputCount <= 0) {
        throw new Error('Invalid output count');
      }

      txn.userInputs.maxFee = convertToUnit({
        amount: fee,
        coinId: coin.id,
        fromUnitAbbr: `ETH`,
        toUnitAbbr: getZeroUnit(coin.id).abbr,
      }).amount;
    }
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
      unitAbbr:
        account.unit ??
        getZeroUnit(account.parentAssetId, account.assetId).abbr,
    });

    console.log(
      `${i}. ${colors.grey(output.address)} (${colors.cyan(
        `${amount} ${unit.abbr})`,
      )}`,
    );
    totalToDeduct = totalToDeduct.plus(output.amount);
    i += 1;
  }

  if (coin.family === coinFamiliesMap.bitcoin) {
    const txn = transaction as IPreparedBtcTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: coin.id,
      amount: txn.computedData.fee,
      unitAbbr:
        account.unit ??
        getZeroUnit(account.parentAssetId, account.assetId).abbr,
    });
    console.log(`Transaction fees: ${colors.cyan(`${amount} ${unit.abbr}`)}`);
    totalToDeduct = totalToDeduct.plus(txn.computedData.fee);
  }

  if (coin.family === coinFamiliesMap.evm) {
    const txn = transaction as IPreparedEvmTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: coin.id,
      amount: txn.computedData.fee,
      unitAbbr:
        account.unit ??
        getZeroUnit(account.parentAssetId, account.assetId).abbr,
    });
    console.log(`Transaction fees: ${colors.cyan(`${amount} ${unit.abbr}`)}`);
    totalToDeduct = totalToDeduct.plus(txn.computedData.fee);
  }

  if (coin.family === coinFamiliesMap.solana) {
    const txn = transaction as IPreparedSolanaTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: coin.id,
      amount: txn.computedData.fees,
      unitAbbr:
        account.unit ??
        getZeroUnit(account.parentAssetId, account.assetId).abbr,
    });
    console.log(`Transaction fees: ${colors.cyan(`${amount} ${unit.abbr}`)}`);
    totalToDeduct = totalToDeduct.plus(txn.computedData.fees);
  }

  if (coin.family === coinFamiliesMap.starknet) {
    const txn = transaction as IPreparedStarknetTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: coin.id,
      amount: new BigNumber(txn.computedData.maxFee, 16).toString(10),
      unitAbbr:
        account.unit ??
        getZeroUnit(account.parentAssetId, account.assetId).abbr,
    });
    console.log(`Transaction fees: ${colors.cyan(`${amount} ${unit.abbr}`)}`);
    totalToDeduct = totalToDeduct.plus(txn.computedData.maxFee, 16);
  }

  const { amount, unit } = getParsedAmount({
    coinId: coin.id,
    amount: totalToDeduct.toString(),
    unitAbbr:
      account.unit ?? getZeroUnit(account.parentAssetId, account.assetId).abbr,
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

  const coin = coinList[account.parentAssetId];
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
