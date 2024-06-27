import { ITronTrc20Token } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ISignedTransaction,
  IUnsignedTransaction,
} from '@cypherock/sdk-app-tron';

import logger from './logger';
import { getCoinSupportTronWeb } from './tronweb';

import { estimateTrc20SendEnergyConsumption } from '../services';

export const prepareUnsignedSendTxn = async (params: {
  from: string;
  to: string;
  amount: string;
  averageEnergyPrice: string;
  tokenDetails?: ITronTrc20Token;
}) => {
  const tronWeb = getCoinSupportTronWeb();
  let txn: IUnsignedTransaction;
  let estimatedEnergy: number | undefined;

  if (params.tokenDetails) {
    const result = await estimateTrc20SendEnergyConsumption({
      from: params.from,
      to: params.to,
      amount: params.amount,
      contract: params.tokenDetails.address,
    });

    if (result.result) {
      estimatedEnergy = result.energy_required;
    } else {
      logger.warn('Failed to estimate energy consumption');
      logger.warn(result);
    }

    // 100 TRX fee limit by default
    const feeLimit = estimatedEnergy
      ? new BigNumber(estimatedEnergy)
          .multipliedBy(params.averageEnergyPrice)
          .toNumber()
      : 100_000_000;

    txn = (
      await tronWeb.transactionBuilder.triggerSmartContract(
        params.tokenDetails.address,
        'transfer(address,uint256)',
        {
          feeLimit,
          callValue: 0,
        },
        [
          {
            type: 'address',
            value: params.to,
          },
          {
            type: 'uint256',
            value: new BigNumber(params.amount).toNumber(),
          },
        ],
        tronWeb.address.toHex(params.from),
      )
    ).transaction;
  } else {
    txn = await tronWeb.transactionBuilder.sendTrx(
      params.to,
      parseInt(params.amount, 10),
      params.from,
    );
  }

  txn.raw_data.expiration = txn.raw_data.timestamp + 5 * 60 * 1000;
  const hex = tronWeb.utils.transaction.txPbToRawDataHex(
    tronWeb.utils.transaction.txJsonToPb(txn),
  );
  txn.raw_data_hex = hex;

  return { txn, estimatedEnergy };
};

// Refer: https://developers.tron.network/docs/faq#5-how-to-calculate-the-bandwidth-and-energy-consumed-when-callingdeploying-a-contract
export function estimateBandwidth(
  txn: IUnsignedTransaction | ISignedTransaction,
) {
  const DATA_HEX_PROTOBUF_EXTRA = 3;
  const MAX_RESULT_SIZE_IN_TX = 64;
  const A_SIGNATURE = 67;

  let len =
    txn.raw_data_hex.length / 2 +
    DATA_HEX_PROTOBUF_EXTRA +
    MAX_RESULT_SIZE_IN_TX;

  const signatureListSize = (txn as any).signature?.length || 1;
  len += A_SIGNATURE * signatureListSize;

  return len;
}
