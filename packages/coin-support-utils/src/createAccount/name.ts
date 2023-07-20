import { IAccount } from '@cypherock/db-interfaces';

// TODO: decided on account name generation
export const createAccountNameGenerator = (coinName: string) => {
  const newAccountsPerScheme: Record<string, number | undefined> = {};

  return (schemeName: string, existingAccounts: IAccount[]) => {
    const totalNewAccountsInThisScheme =
      (newAccountsPerScheme[schemeName] ?? 0) + 1;

    newAccountsPerScheme[schemeName] = totalNewAccountsInThisScheme;

    const totalAccountsWithSameScheme = existingAccounts.filter(
      a => a.extraData?.derivationScheme === schemeName,
    ).length;

    const index = totalAccountsWithSameScheme + totalNewAccountsInThisScheme;

    const name = `${coinName} ${index}`;

    return name;
  };
};
