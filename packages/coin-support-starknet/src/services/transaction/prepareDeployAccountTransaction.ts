import { starknetCoinList } from '@cypherock/coins';

import {
  StarknetDeployAccountTransaction,
  StarknetPrepareDeployTransactionParams,
  StarknetTransactionTypes,
} from './types';

import { getCoinSupportStarknetLib } from '../../utils';

export const getConstructorCalldata = (pubKey: string) => {
  const { CallData } = getCoinSupportStarknetLib();

  return CallData.toHex(CallData.compile([0, pubKey, 1]));
};

export const prepareDeployAccountTransaction = (
  params: StarknetPrepareDeployTransactionParams,
): StarknetDeployAccountTransaction => {
  const { signature: inputSignature, salt = 'salt' } = params;

  let signature: string[] = [];
  if (inputSignature && inputSignature.length > 0) {
    signature = [
      inputSignature.slice(0, inputSignature.length / 2),
      inputSignature.slice(inputSignature.length / 2, inputSignature.length),
    ];
  }

  return {
    type: StarknetTransactionTypes.DEPLOY_ACCOUNT,
    constructor_calldata: getConstructorCalldata(salt),
    class_hash: starknetCoinList[params.assetId].argentXClassHash,
    contract_address_salt: salt,
    version: '0x3',
    nonce: params.nonce,
    tip: '0x0',
    paymaster_data: [],
    nonce_data_availability_mode: 'L1',
    fee_data_availability_mode: 'L1',
    resource_bounds: params.resourceBounds,
    signature,
  };
};
