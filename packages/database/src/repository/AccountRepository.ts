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
  // eslint-disable-next-line class-methods-use-this
  getDisplayAccounts(
    params: IGetOptions<IAccount>,
  ): Promise<IAccountDisplayInfo[]> {
    throw new Error(`Method not implemented. ${params}`);
  }
}
