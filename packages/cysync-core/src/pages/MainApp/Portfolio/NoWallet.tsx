import {
  NoAccountWrapper,
  SkeletonLoader,
  GraphGreyIcon,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React from 'react';

import { openWalletActionsDialog } from '~/actions';
import { DeviceHandlingState, useDevice } from '~/context';
import { useWalletSync } from '~/hooks';
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
  const { onWalletSync } = useWalletSync();
  const { deviceHandlingState } = useDevice();

  const handleAddWalletClick = () => {
    dispatch(openWalletActionsDialog());
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
        $buttonTwoIsDisabled={
          deviceHandlingState !== DeviceHandlingState.USABLE
        }
        onClick={handleAddWalletClick}
        onClickTwo={onWalletSync}
        $noLoaderContainer
      />
    </NoAccountWrapper>
  );
};
