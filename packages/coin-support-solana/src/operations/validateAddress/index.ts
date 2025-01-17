import { IValidateAddressParams } from '@cypherock/coin-support-interfaces';
import { solanaCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import WAValidator from 'multicoin-address-validator';

const SOLANA_ACCOUNT_ADDRESS_LENGTH = 44;

export const validateAddress = (params: IValidateAddressParams) => {
  const { address, coinId } = params;
  const coin = solanaCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  return (
    address.length === SOLANA_ACCOUNT_ADDRESS_LENGTH &&
    WAValidator.validate(address, 'solana', coin.isTest ? 'testnet' : 'prod')
  );
};
