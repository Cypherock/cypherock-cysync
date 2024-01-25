import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { btcCoinList, ICoinInfo } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import coinselect from 'coinselect';
import coinselectSplit from 'coinselect/split';

import { IPrepareBtcTransactionParams } from './types';

import { getFirstUnusedAddress, IUtxo } from '../../services';
import { IPreparedBtcTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareBtcTransactionParams,
  coin: ICoinInfo,
) => {
  const outputAddressValidation: boolean[] = [];

  for (const output of params.txn.userInputs.outputs) {
    let isValid = true;

    if (
      output.address &&
      !validateAddress({ address: output.address, coinId: coin.id })
    ) {
      isValid = false;
    }

    outputAddressValidation.push(isValid);
  }

  return outputAddressValidation;
};

const mapUtxo = (utxo: IUtxo) => ({
  address: utxo.address,
  txId: utxo.txid,
  vout: utxo.vout,
  value: parseInt(utxo.value, 10),
  block_height: utxo.height,
  confirmations: utxo.confirmations,
  derivationPath: utxo.path,
});

export const prepareTransaction = async (
  params: IPrepareBtcTransactionParams,
): Promise<IPreparedBtcTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(db, btcCoinList, accountId);

  const outputsAddresses = validateAddresses(params, coin);

  const outputList: { address: string; value?: number }[] = [];

  let result: {
    inputs: any[] | undefined;
    outputs: any[] | undefined;
    fee: number;
    isNotOverDustThreshold?: boolean;
  };

  let isNotOverDustThreshold = false;

  if (txn.userInputs.isSendAll) {
    // Send all requires only 1 output, if more than one output is present,
    // force remove outputs other than the first one
    if (txn.userInputs.outputs.length > 1) {
      txn.userInputs.outputs = txn.userInputs.outputs.slice(0, 1);
    }

    outputList.push({
      address: txn.userInputs.outputs[0].address,
    });

    result = coinselectSplit(
      txn.staticData.utxos.map(mapUtxo),
      outputList,
      txn.userInputs.feeRate,
      3,
    );
    isNotOverDustThreshold = Boolean(result.isNotOverDustThreshold);
    if (isNotOverDustThreshold) {
      result.outputs = [
        {
          ...(txn.userInputs.outputs[0] ?? {}),
          value: txn.staticData.utxos
            .reduce((acc, utxo) => acc.plus(utxo.value), new BigNumber(0))
            .minus(result.fee)
            .toString(),
        },
      ];
    }
  } else {
    for (const output of txn.userInputs.outputs) {
      let value = 0;

      if (output.amount) {
        value = parseInt(output.amount, 10);
      }

      outputList.push({
        address: output.address,
        value,
      });
    }

    result = coinselect(
      txn.staticData.utxos.map(mapUtxo),
      outputList,
      txn.userInputs.feeRate,
    );
  }

  const hasEnoughBalance =
    result.outputs !== undefined && result.inputs !== undefined;
  const unusedAddress = await getFirstUnusedAddress(account, 'internal');

  if (
    txn.userInputs.isSendAll &&
    txn.userInputs.outputs.length > 0 &&
    result.outputs
  ) {
    txn.userInputs.outputs[0].amount = result.outputs[0].value.toString();
  }

  const isValidFee = result.fee > 0;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
      isValidFee,
      isNotOverDustThreshold,
    },
    computedData: {
      inputs: result.inputs ?? [],
      fee: result.fee,
      outputs: (result.outputs ?? []).map((e: any) => {
        if (e.address === undefined) {
          return {
            ...e,
            address: unusedAddress.address,
            derivationPath: unusedAddress.derivationPath,
          };
        }
        return e;
      }),
    },
  };
};
