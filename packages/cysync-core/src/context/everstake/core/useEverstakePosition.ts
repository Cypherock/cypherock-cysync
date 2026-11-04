import { IAccount } from '@cypherock/db-interfaces';
import { useCallback, useEffect, useState } from 'react';

import * as everstakeEthService from '~/services/everstakeEthService';
import * as everstakePolService from '~/services/everstakePolService';
import logger from '~/utils/logger';

export const useEverstakePosition = (params: {
  selectedAccount: IAccount | undefined;
  isPol: boolean;
}) => {
  const { selectedAccount, isPol } = params;

  const [poolInfo, setPoolInfo] =
    useState<everstakeEthService.IEverstakePoolInfo>();
  const [userPosition, setUserPosition] =
    useState<everstakeEthService.IEverstakeUserPosition>();
  const [withdrawRequest, setWithdrawRequest] =
    useState<everstakeEthService.IEverstakeWithdrawRequest>();
  const [polPosition, setPolPosition] =
    useState<everstakePolService.IEverstakePolPosition>();
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!isPol) {
      everstakeEthService
        .getPoolInfo()
        .then(setPoolInfo)
        .catch((e: any) =>
          logger.error('Everstake poolInfo fetch failed', e as object),
        );
    }
  }, [isPol]);

  const refreshPosition = useCallback(
    (account: IAccount) => {
      if (isPol) {
        return everstakePolService
          .getUserPosition(account.xpubOrAddress)
          .then(setPolPosition);
      }
      return Promise.all([
        everstakeEthService.getUserPosition(account.xpubOrAddress),
        everstakeEthService.getWithdrawRequest(account.xpubOrAddress),
      ]).then(([pos, wr]) => {
        setUserPosition(pos);
        setWithdrawRequest(wr);
      });
    },
    [isPol],
  );

  useEffect(() => {
    if (!selectedAccount?.xpubOrAddress) return;
    setDataLoading(true);
    refreshPosition(selectedAccount)
      .catch((e: any) =>
        logger.error('Everstake position fetch failed', e as object),
      )
      .finally(() => setDataLoading(false));
  }, [selectedAccount?.xpubOrAddress, isPol, refreshPosition]);

  return {
    poolInfo,
    userPosition,
    withdrawRequest,
    polPosition,
    dataLoading,
    setDataLoading,
    refreshPosition,
  };
};
