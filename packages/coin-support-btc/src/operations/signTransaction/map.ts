import { mapDerivationPath } from '@cypherock/coin-support-utils';
import { ISignTxnParams } from '@cypherock/sdk-app-btc';

import { IPreparedBtcTransaction } from '../transaction';

export const mapPreparedTxnToSdkTxn = (
  transaction: IPreparedBtcTransaction,
): ISignTxnParams['txn'] => ({
  inputs: transaction.computedData.inputs.map(input => {
    const path = mapDerivationPath(input.derivationPath);

    return {
      address: input.address,
      value: input.value.toString(),
      changeIndex: path[3],
      addressIndex: path[4],
      prevIndex: input.vout,
      prevTxnId: input.txId,
    };
  }),
  outputs: transaction.computedData.outputs.map(output => {
    if (output.derivationPath) {
      const path = mapDerivationPath(output.derivationPath);

      return {
        isChange: true,
        address: output.address,
        value: output.value.toString(),
        changeIndex: path[3],
        addressIndex: path[4],
      };
    }

    return {
      isChange: false,
      address: output.address,
      value: output.value.toString(),
    };
  }),
});
