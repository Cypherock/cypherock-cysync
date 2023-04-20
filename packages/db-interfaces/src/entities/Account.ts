import { IAsset } from "./Asset";
import { IBaseRepository } from "./BaseRepository";
import { IWallet } from "./Wallet";

export interface IAccount {
	id: string;
	name: string;
	xpub: string;
	balance: string;
	unit: string;
	derivationPath: string;
	type: string;
	assetSpecificData: any;
}

export interface IAccountRepository extends IBaseRepository<IAccount> {
	getWallets(IAccount): Promise<IWallet[]>;
	getChildren(IAccount): Promise<IAccount[]>;
	getParent(IAccount): Promise<IAccount>;
	getAssets(IAccount): Promise<IAsset[]>;
}
