import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';

import { getTransactionFee } from '../../services';
import { getIngressExpiry, getNonce } from '../../utils';
import { IPreparedIcpTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedIcpTransaction> => {
  const { accountId } = params;

  const fees = (await getTransactionFee()).toString();

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isInvalidMemo: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
    },
    staticData: {
      fees,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fees,
      ingressExpiry: getIngressExpiry(),
      nonce: getNonce(),
    },
  };
};
