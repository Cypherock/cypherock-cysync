import { IWallet } from '@cypherock/db-interfaces';

export interface UseGraphProps {
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
  selectedWallet?: IWallet;
}
