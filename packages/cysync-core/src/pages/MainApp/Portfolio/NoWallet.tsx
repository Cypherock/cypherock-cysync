import {
  NoAccountWrapper,
  SkeletonLoader,
  GraphGreyIcon,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { useCallback } from 'react';

import { openWalletActionsDialog } from '~/actions';
import { DeviceHandlingState, useDevice } from '~/context';
import { useWalletSync } from '~/hooks';
import {
  useAppSelector,
  selectLanguage,
  useAppDispatch,
  selectWallets,
} from '~/store';
import logger from '~/utils/logger';

const selector = createSelector(
  [selectLanguage, selectWallets],
  (lang, { syncWalletStatus }) => ({
    lang,
    syncWalletStatus,
  }),
);

export const NoWallet = () => {
  const { lang, syncWalletStatus } = useAppSelector(selector);
  const dispatch = useAppDispatch();
  const { onWalletSync } = useWalletSync();
  const { deviceHandlingState } = useDevice();

  const handleAddWalletClick = () => {
    logger.info('Button Click: Add Wallet', {
      source: `${NoWallet.name}/NoAccountWrapper`,
    });
    dispatch(openWalletActionsDialog());
  };

  const handleWalletSync = useCallback(
    (e?: any) => {
      logger.info('Button Click: Sync Wallet', {
        source: `${NoWallet.name}/NoAccountWrapper`,
      });
      onWalletSync(e);
    },
    [onWalletSync],
  );

  return (
    <NoAccountWrapper>
      <SkeletonLoader
        loader={<GraphGreyIcon />}
        text={lang.strings.portfolio.walletMissing.text}
        subText={lang.strings.portfolio.walletMissing.subText}
        subText2={lang.strings.portfolio.walletMissing.subText2}
        $buttonOne={lang.strings.buttons.addWallet}
        $buttonTwo={lang.strings.buttons.syncWallets}
        $buttonTwoIsLoading={syncWalletStatus === 'loading'}
        $buttonTwoIsDisabled={
          deviceHandlingState !== DeviceHandlingState.USABLE ||
          syncWalletStatus === 'loading'
        }
        onClick={handleAddWalletClick}
        onClickTwo={handleWalletSync}
        $noLoaderContainer
      />
    </NoAccountWrapper>
  );
};
