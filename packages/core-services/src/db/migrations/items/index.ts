import erc20Migrations from './000.erc20Token';
import transactionIdMigration from './001.transactionId';
import erc20Migrations2 from './002.erc20Token';
import erc20Migrations3 from './003.erc20Token';

export const migrationItems = [
  erc20Migrations,
  transactionIdMigration,
  erc20Migrations2,
  erc20Migrations3,
];
