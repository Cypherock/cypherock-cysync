import { IDatabase, IWallet } from '@cypherock/db-interfaces';
import colors from 'colors/safe';

export interface IListWalletFlags {
  short?: boolean;
}

const walletPropertiesToDisplay = ['__id', 'name', 'hasPin', 'hasPassphrase'];

const mapWalletToDisplay = (wallet: IWallet) => {
  const displayWallet: any = {};

  for (const key of walletPropertiesToDisplay) {
    displayWallet[key] = (wallet as any)[key];
  }

  return displayWallet;
};

const mapWalletToShortDisplay = (wallet: IWallet, index: number) =>
  `${index + 1}. ${wallet.name} ${colors.grey(`(${wallet.__id})`)}`;

export const listWallets = async (
  db: IDatabase,
  options: { flags: IListWalletFlags },
) => {
  const wallets = await db.wallet.getAll();

  if (options.flags.short) {
    const walletsToDisplay = wallets.map(mapWalletToShortDisplay);
    walletsToDisplay.forEach(w => console.log(w));
  } else {
    console.table(wallets.map(mapWalletToDisplay));
  }
};
