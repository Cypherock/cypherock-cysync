import { IDatabase, IWallet } from '@cypherock/db-interfaces';
import colors from 'colors/safe';
import lodash from 'lodash';

export interface IListWalletFlags {
  short?: boolean;
}

const walletPropertiesToDisplay: (keyof IWallet)[] = [
  '__id',
  'name',
  'hasPin',
  'hasPassphrase',
];

const mapWalletToDisplay = (wallet: IWallet) =>
  lodash.pick(wallet, walletPropertiesToDisplay);

const mapWalletToShortDisplay = (wallet: IWallet, index: number) =>
  `${index + 1}. ${wallet.name} ${colors.grey(`(${wallet.__id})`)}`;

export const listWallets = async (
  db: IDatabase,
  options: { flags: IListWalletFlags },
) => {
  const wallets = await db.wallet.getAll();

  if (wallets.length <= 0) {
    console.log(colors.grey('No wallets found'));
    return;
  }

  if (options.flags.short) {
    const walletsToDisplay = wallets.map(mapWalletToShortDisplay);
    walletsToDisplay.forEach(w => console.log(w));
  } else {
    console.table(wallets.map(mapWalletToDisplay));
  }
};
