import { IAccount } from '@cypherock/db-interfaces';

type CoinType = any;

export interface GetAccountAndCoinTestCase {
  input: {
    accountId: string;
    db: {
      account: IAccount[];
    };
    coinList: Record<string, CoinType>;
  };
  output: {
    account: IAccount;
    parentAccount: IAccount;
    coin: Exclude<CoinType, null | undefined>;
  };
}

export interface IFixtures {
  valid: GetAccountAndCoinTestCase[];
}
