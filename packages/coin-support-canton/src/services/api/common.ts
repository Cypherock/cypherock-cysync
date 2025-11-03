import { MakeRequestOptions } from '@cypherock/cysync-utils';

export const getRequestOptions = (
  accessToken?: string,
): MakeRequestOptions => ({
  config: accessToken
    ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    : undefined,
});
