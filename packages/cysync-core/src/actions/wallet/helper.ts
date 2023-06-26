import { IWallet } from '@cypherock/db-interfaces';
import { IWalletItem } from '@cypherock/sdk-app-manager';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

export const mapWalletToDbInstance = (
  wallet: IWalletItem,
  deviceSerial: string,
): IWallet => ({
  __id: uint8ArrayToHex(wallet.id),
  name: wallet.name,
  hasPassphrase: wallet.hasPassphrase,
  hasPin: wallet.hasPin,
  deviceId: deviceSerial,
});

export const mapWalletsToDbInstance = (
  walletList: IWalletItem[],
  deviceSerial: string,
): IWallet[] =>
  walletList.map(wallet => mapWalletToDbInstance(wallet, deviceSerial));

export const sameWalletIdComparator = (walletA: IWallet, walletB: IWallet) =>
  walletA.__id === walletB.__id;

export const walletFileds = ['name', 'hasPassphrase', 'hasPin', 'deviceId'];

export const walletDetailsComparator = (walletA: any, walletB: any) =>
  walletFileds.reduce(
    (result, field) => result && walletA[field] === walletB[field],
    true,
  );
