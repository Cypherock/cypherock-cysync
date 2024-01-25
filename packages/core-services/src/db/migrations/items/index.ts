import erc20Migrations from './000.erc20Token';
import transactionIdMigration from './001.transactionId';

export const migrationItems = [erc20Migrations, transactionIdMigration];
