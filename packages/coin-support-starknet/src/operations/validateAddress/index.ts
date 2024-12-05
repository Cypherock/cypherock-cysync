import { IValidateAddressParams } from '@cypherock/coin-support-interfaces';

export const validateAddress = (params: IValidateAddressParams) => {
  console.log(params);
  return true;
};
