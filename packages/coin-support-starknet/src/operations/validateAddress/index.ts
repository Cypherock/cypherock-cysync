import { getStarknetApiJs } from '@cypherock/sdk-app-starknet/dist/utils';

export const validateAddress = (address: string) => {
  try {
    getStarknetApiJs().validateAndParseAddress(address);
    return true;
  } catch {
    return false;
  }
};
