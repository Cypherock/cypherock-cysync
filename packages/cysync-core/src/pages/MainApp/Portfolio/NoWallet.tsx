import {
  NoAccountWrapper,
  SkeletonLoader,
  GraphGreyIcon,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React from 'react';

import { openWalletActionsDialog, syncWalletsWithDevice } from '~/actions';
import { useDevice } from '~/context';
import {
  useAppSelector,
  selectLanguage,
  useAppDispatch,
  selectWallets,
} from '~/store';

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
  const { connection, connectDevice } = useDevice();

  const handleAddWalletClick = () => {
    dispatch(openWalletActionsDialog());
  };

  const handleWalletSync = () => {
    dispatch(
      syncWalletsWithDevice({
        connection,
        connectDevice,
        doFetchFromDevice: true,
      }),
    );
  };

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
        onClick={handleAddWalletClick}
        onClickTwo={handleWalletSync}
        $noLoaderContainer
      />
    </NoAccountWrapper>
  );
};
