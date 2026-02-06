import { ErrorActionMap, ErrorIconNameMap } from '~/constants/errors';

export const createCustomError = (heading: string, subtext?: string) => ({
  custom: {
    heading,
    subtext,
    details: {
      iconName: ErrorIconNameMap.default,
      action: {
        name: ErrorActionMap.retry,
      },
    },
  },
  isCustomError: true,
});
