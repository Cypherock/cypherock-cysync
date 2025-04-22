import {
  IIcpGetAddressDetailsFromPublickKeyParams,
  IIcpGetAddressDetailsFromPublickKeyResult,
} from './types';

import {
  deriveAccountIdFromPrincipal,
  derivePrincipal,
  derivePrincipalIdFromPrincipal,
} from '../../utils';

export const getAddressDetailsFromPublicKey = (
  params: IIcpGetAddressDetailsFromPublickKeyParams,
): IIcpGetAddressDetailsFromPublickKeyResult => {
  const principal = derivePrincipal(params.pubKey);

  return {
    accountId: deriveAccountIdFromPrincipal(principal),
    principalId: derivePrincipalIdFromPrincipal(principal),
  };
};
