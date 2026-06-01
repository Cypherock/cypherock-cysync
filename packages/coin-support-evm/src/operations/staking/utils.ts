import { makePostRequest, BigNumber } from '@cypherock/cysync-utils';

import { IPreparedEvmTransaction } from '../transaction';
import { IHyspServerTxParams } from './types';

const BASE_URL = 'http://localhost:5001/hysp';

export const callHyspBuildEndpoint = async (
  path: string,
  body: Record<string, unknown>,
): Promise<IHyspServerTxParams> => {
  const response = await makePostRequest(`${BASE_URL}/${path}`, body);
  return response.data.data as IHyspServerTxParams;
};

export const buildPreparedTxn = (
  serverTx: IHyspServerTxParams,
  txn: IPreparedEvmTransaction,
): IPreparedEvmTransaction => {
  const gasPrice = txn.userInputs.gasPrice ?? txn.staticData.averageGasPrice;
  const fee = new BigNumber(serverTx.gasLimit).multipliedBy(gasPrice);

  return {
    ...txn,
    userInputs: {
      ...txn.userInputs,
      outputs: [{ address: serverTx.to, amount: serverTx.value, remarks: '' }],
    },
    computedData: {
      output: { address: serverTx.to, amount: serverTx.value },
      data: serverTx.data,
      fee: fee.toString(10),
      gasLimit: serverTx.gasLimit,
      gasLimitEstimate: serverTx.gasLimit,
      l1Fee: '0',
      gasPrice,
    },
  };
};
