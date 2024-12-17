import {
  StarknetInvokeTransaction,
  StarknetPrepareInvokeTransactionParams,
} from './types';

import { getCoinSupportStarknetLib } from '../../utils';

export const getInvokeCalldata = (
  contractAddress: string,
  recipientAddres: string,
  amount: string,
) => {
  const starknetLib = getCoinSupportStarknetLib();

  const initialCalldata = [recipientAddres, amount, '0x00'];

  const orderCalls = [
    {
      contractAddress,
      entrypoint: 'transfer',
      calldata:
        Array.isArray(initialCalldata) && '__compiled__' in initialCalldata
          ? initialCalldata
          : starknetLib.CallData.compile(initialCalldata),
    },
  ];

  return starknetLib.CallData.toHex(
    starknetLib.CallData.compile({ orderCalls }),
  );
};

export const prepareInvokeTransaction = (
  params: StarknetPrepareInvokeTransactionParams,
): StarknetInvokeTransaction => {
  const { signature: inputSignature } = params;

  let signature: string[] = [];
  if (inputSignature && inputSignature.length > 0) {
    signature = [
      inputSignature.slice(0, inputSignature.length / 2),
      inputSignature.slice(inputSignature.length / 2, inputSignature.length),
    ];
  }

  return {
    type: 'INVOKE',
    sender_address: params.address,
    calldata: getInvokeCalldata(
      params.contractAddress,
      params.recipientAddress,
      params.amount,
    ),
    version: '0x3',
    nonce: params.nonce,
    tip: '0x0',
    paymaster_data: [],
    account_deployment_data: [],
    nonce_data_availability_mode: 'L1',
    fee_data_availability_mode: 'L1',
    resource_bounds: params.resourceBounds,
    signature,
  };
};
