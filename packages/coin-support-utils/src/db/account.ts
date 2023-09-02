import { assert } from '@cypherock/cysync-utils';
import { IDatabase } from '@cypherock/db-interfaces';

export async function getAccountAndCoin<T>(
  db: IDatabase,
  coinList: Record<string, T>,
  accountId: string,
) {
  const account = await db.account.getOne({ __id: accountId });

  assert(account, new Error('Account not found'));

  const coin = coinList[account.assetId];

  assert(coin, new Error('Coin not found'));

  return { account, coin };
}
