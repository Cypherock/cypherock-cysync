import { IValidateAddressParams } from '@cypherock/coin-support-interfaces';
import { cantonCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

export const validateAddress = (params: IValidateAddressParams) => {
  const { address, coinId } = params;
  const coin = cantonCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  // return WAValidator.validate(address, 'canton');
  const splitted = address.split('::');
  if (!splitted || splitted.length !== 2) return false;

  const [partyHint, fingerprint] = splitted;

  if (!partyHint || !fingerprint) return false;

  return (
    partyHint.length > 0 && partyHint.length < 178 && fingerprint.length === 68
  );
};
