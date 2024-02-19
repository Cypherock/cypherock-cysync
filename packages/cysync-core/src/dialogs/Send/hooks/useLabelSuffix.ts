import { CoinFamily, EvmIdMap } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';

import { selectLanguage, useAppSelector } from '~/store';

const getDefaultSuffix = () => '';
export const useLabelSuffix = () => {
  const lang = useAppSelector(selectLanguage);
  const getEvmSuffix = (assetId?: string) => {
    if (EvmIdMap.optimism === assetId) return lang.strings.send.optimism.suffix;
    return '';
  };

  const labelSuffixMap: Record<CoinFamily, (assetId?: string) => string> = {
    bitcoin: getDefaultSuffix,
    evm: getEvmSuffix,
    near: getDefaultSuffix,
    solana: getDefaultSuffix,
    starknet: getDefaultSuffix,
  };
  const getFeeLabelSuffix = (selectedAccount?: IAccount) => {
    if (!selectedAccount) return '';
    return labelSuffixMap[selectedAccount.familyId as CoinFamily](
      selectedAccount.assetId,
    );
  };

  return getFeeLabelSuffix;
};
