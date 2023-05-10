import {
  IAccount,
  IAccountDisplayInfo,
  IAccountRepository,
  IGetOptions,
} from '@cypherock/db-interfaces';
import { Repository } from './Repository';

export class AccountRepository
  extends Repository<IAccount>
  implements IAccountRepository
{
  getDisplayAccounts: (
    params: IGetOptions<IAccount>,
  ) => Promise<IAccountDisplayInfo[]>;
}
