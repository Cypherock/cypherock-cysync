import { IAccount } from '@cypherock/db-interfaces';
import { useCallback, useEffect, useState } from 'react';

import * as everstakeSolService from '~/services/everstakeSolService';
import logger from '~/utils/logger';

export const useSolPosition = (params: {
  selectedAccount: IAccount | undefined;
}) => {
  const { selectedAccount } = params;

  const [position, setPosition] =
    useState<everstakeSolService.IEverstakeSolPosition>();
  const [dataLoading, setDataLoading] = useState(false);

  const refreshPosition = useCallback(
    (account: IAccount) =>
      everstakeSolService
        .getUserPosition(account.xpubOrAddress)
        .then(setPosition),
    [],
  );

  useEffect(() => {
    if (!selectedAccount?.xpubOrAddress) return;
    setPosition(undefined);
    setDataLoading(true);
    refreshPosition(selectedAccount)
      .catch((e: any) =>
        logger.error('Everstake SOL position fetch failed', e as object),
      )
      .finally(() => setDataLoading(false));
  }, [selectedAccount?.xpubOrAddress, refreshPosition]);

  return { position, dataLoading, setDataLoading, refreshPosition };
};
