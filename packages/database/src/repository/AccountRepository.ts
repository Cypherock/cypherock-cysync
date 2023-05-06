import {
  IAccount,
  IAccountDisplayInfo,
  IAccountRepository,
  IGetOptions,
} from '@cypherock/db-interfaces';
import { BaseRepository } from './BaseRepository';
import { Account } from '../entity/Account';

export class AccountRepository
  extends BaseRepository<Account>
  implements IAccountRepository
{
  getDisplayAccounts: (
    params: IGetOptions<IAccount>,
  ) => Promise<IAccountDisplayInfo[]>;
}
