import {
  ISignedTransaction,
  IUnsignedTransaction,
} from '@cypherock/sdk-app-tron';

import { getCoinSupportTronWeb } from './tronweb';

export const prepareUnsignedSendTxn = async (params: {
  from: string;
  to: string;
  amount: string;
}): Promise<IUnsignedTransaction> => {
  const tronWeb = getCoinSupportTronWeb();
  const txn = await tronWeb.transactionBuilder.sendTrx(
    params.to,
    parseInt(params.amount, 10),
    params.from,
  );
  txn.raw_data.expiration = txn.raw_data.timestamp + 5 * 60 * 1000;
  const hex = tronWeb.utils.transaction.txPbToRawDataHex(
    tronWeb.utils.transaction.txJsonToPb(txn),
  );
  txn.raw_data_hex = hex;

  return txn;
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
