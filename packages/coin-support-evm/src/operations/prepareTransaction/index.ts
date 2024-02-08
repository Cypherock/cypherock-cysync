import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import {
  evmCoinList,
  ICoinInfo,
  IEvmErc20Token,
  erc20Abi,
  IEvmCoinInfo,
} from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';

import { IPrepareEvmTransactionParams } from './types';

import { estimateGas } from '../../services';
import logger from '../../utils/logger';
import { getCoinSupportWeb3Lib } from '../../utils/web3';
import { IPreparedEvmTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareEvmTransactionParams,
  coin: ICoinInfo,
) => {
  const outputAddressValidation: boolean[] = [];

  for (const output of params.txn.userInputs.outputs) {
    let isValid = true;

    /**
     * We allow empty string in the validation (error prompt should not
     * appear for empty string). And validate only non-empty strings.
     */
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

const generateDataField = (params: {
  contractAddress: string;
  senderAddress: string;
  receiverAddress: string;
  amount: string;
}) => {
  try {
    const Web3 = getCoinSupportWeb3Lib();
    const web3 = new Web3();
    const erc20Contract = new web3.eth.Contract(
      erc20Abi,
      params.contractAddress,
      {
        from: params.senderAddress,
      },
    );
    let amount = '0';
    const parsedAmountParam = new BigNumber(params.amount);
    if (!parsedAmountParam.isNaN()) {
      amount = parsedAmountParam.toString();
    }

    return (erc20Contract.methods.transfer as any)(
      params.receiverAddress || params.senderAddress,
      amount,
    ).encodeABI();
  } catch (e) {
    logger.error(e);
    return '0x';
  }
};

async function estimateFees(params: {
  coin: IEvmCoinInfo;
  account: IAccount;
  toAddressForEstimate: string;
  data: string;
  txn: IPreparedEvmTransaction;
}) {
  const { coin, account, toAddressForEstimate, data, txn } = params;

  const gasEstimate = await estimateGas(coin.id, {
    from: account.xpubOrAddress,
    to: toAddressForEstimate,
    value: '0',
    data,
  });

  const gasLimit = txn.userInputs.gasLimit ?? gasEstimate.limit;
  const gasPrice = txn.userInputs.gasPrice ?? txn.staticData.averageGasPrice;
  const l1Fee = gasEstimate.l1Cost;
  const fee = new BigNumber(gasLimit).multipliedBy(gasPrice).plus(l1Fee);
  return { gasLimit, fee, gasEstimate, l1Fee, gasPrice };
}

export const prepareTransaction = async (
  params: IPrepareEvmTransactionParams,
): Promise<IPreparedEvmTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin, parentAccount } = await getAccountAndCoin(
    db,
    evmCoinList,
    accountId,
  );
  let tokenDetails: IEvmErc20Token | undefined;
  if (parentAccount !== undefined)
    tokenDetails = evmCoinList[account.parentAssetId].tokens[account.assetId];

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Evm transaction requires exactly 1 output'),
  );

  const outputsAddresses = validateAddresses(params, coin);
  let output = { ...txn.userInputs.outputs[0] };
  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output.amount).toFixed(0);

  let { data } = txn.computedData;

  if (tokenDetails) {
    output = { amount: '0', address: tokenDetails.address };
  }

  let toAddressForEstimate = account.xpubOrAddress;
  if (outputsAddresses[0] && output.address)
    toAddressForEstimate = output.address;

  let gasLimit: string;
  let gasEstimate: { limit: string; l1Cost: string };
  let l1Fee: string;
  let gasPrice: string;
  let fee: BigNumber;

  let hasEnoughBalance: boolean;

  if (tokenDetails) {
    let sendAmount = new BigNumber(txn.userInputs.outputs[0].amount);
    if (txn.userInputs.isSendAll) {
      sendAmount = new BigNumber(new BigNumber(account.balance).toFixed(0));
      txn.userInputs.outputs[0].amount = sendAmount.toString(10);
    }

    data = generateDataField({
      contractAddress: tokenDetails.address,
      senderAddress: account.xpubOrAddress,
      receiverAddress: txn.userInputs.outputs[0].address,
      amount: new BigNumber(txn.userInputs.outputs[0].amount).toFixed(0),
    });

    ({ gasLimit, fee, gasEstimate, l1Fee, gasPrice } = await estimateFees({
      coin,
      account,
      toAddressForEstimate,
      data,
      txn,
    }));

    hasEnoughBalance =
      new BigNumber(parentAccount?.balance ?? '0').isGreaterThanOrEqualTo(
        fee,
      ) &&
      (sendAmount.isNaN() ||
        new BigNumber(account.balance).isGreaterThanOrEqualTo(sendAmount));
  } else {
    ({ gasLimit, fee, gasEstimate, l1Fee, gasPrice } = await estimateFees({
      coin,
      account,
      toAddressForEstimate,
      data,
      txn,
    }));

    let sendAmount = new BigNumber(output.amount);
    if (txn.userInputs.isSendAll) {
      sendAmount = new BigNumber(
        BigNumber.max(new BigNumber(account.balance).minus(fee), 0).toFixed(0),
      );

      output.amount = sendAmount.toString(10);

      // update userInput so that the max amount is editable & not reset to 0
      txn.userInputs.outputs[0].amount = output.amount;
    }
    hasEnoughBalance =
      sendAmount.isNaN() ||
      new BigNumber(account.balance).isGreaterThanOrEqualTo(
        sendAmount.plus(fee),
      );
  }

  txn.userInputs.gasLimit = gasLimit;

  const isValidFee = fee.isGreaterThan(0);
  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
      isValidFee,
    },
    computedData: {
      gasLimit,
      gasLimitEstimate: gasEstimate.limit,
      l1Fee,
      gasPrice,
      fee: fee.toString(10),
      output,
      data,
    },
  };
};
