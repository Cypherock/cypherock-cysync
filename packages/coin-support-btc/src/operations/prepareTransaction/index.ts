import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { btcCoinList, ICoinInfo } from '@cypherock/coins';
import coinselect from 'coinselect';

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
  const { accountId, db } = params;
  const { account, coin } = await getAccountAndCoin(db, btcCoinList, accountId);

  const outputsAddresses = validateAddresses(params, coin);

  const outputList: { address: string; value?: number }[] = [];

  for (const output of params.txn.userInputs.outputs) {
    let value = 0;

    if (output.amount) {
      value = parseInt(output.amount, 10);
    }

    outputList.push({
      address: output.address,
      value,
    });
  }

  const { inputs, outputs, fee } = coinselect(
    params.txn.staticData.utxos.map(mapUtxo),
    outputList,
    params.txn.userInputs.feeRate,
  );

  const hasEnoughBalance = outputs !== undefined && inputs !== undefined;
  const unusedAddress = await getFirstUnusedAddress(account, 'internal');

  return {
    ...params.txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
    },
    computedData: {
      inputs: inputs ?? [],
      fee,
      outputs: (outputs ?? []).map((e: any) => {
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
