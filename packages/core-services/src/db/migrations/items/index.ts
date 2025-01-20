import erc20Migrations from './000.erc20Token';
import transactionIdMigration from './001.transactionId';
import erc20Migrations2 from './002.erc20Token';
import erc20Migrations3 from './003.erc20Token';
import maticToPol from './004.maticToPol';
import erc20Migrations5 from './005.erc20Token';
import resetSolanaTxnHistory from './006.resetSolanaTxnHistory';

export const migrationItems = [
  erc20Migrations,
  transactionIdMigration,
  erc20Migrations2,
  erc20Migrations3,
  maticToPol,
  erc20Migrations5,
  resetSolanaTxnHistory,
];
