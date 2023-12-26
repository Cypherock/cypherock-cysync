import {
  Container,
  GraphGreyIcon,
  NoAccountWrapper,
  SkeletonLoader,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useEffect } from 'react';

import { openAddAccountDialog, openTroubleShootDialog } from '~/actions';
import {
  useAppSelector,
  selectLanguage,
  selectAccounts,
  selectWallets,
  useAppDispatch,
  // GuidedFlowMap,
  TroubleShootMap,
} from '~/store';

import PortfolioPageContent from './Content';
import { NoWallet } from './NoWallet';

import { MainAppLayout } from '../Layout';

const selector = createSelector(
  [selectLanguage, selectWallets, selectAccounts],
  (lang, { wallets }, { accounts }) => ({
    lang,
    wallets,
    accounts,
  }),
);

export const Portfolio: FC = () => {
  const { lang, wallets, accounts } = useAppSelector(selector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openTroubleShootDialog(TroubleShootMap.createWallet));
  }, []);

  const handleAddAccountClick = () => {
    dispatch(openAddAccountDialog());
  };

  const getMainContent = () => {
    if (wallets.length <= 0) {
      return <NoWallet />;
    }

    if (accounts.length <= 0) {
      return (
        <NoAccountWrapper>
          <SkeletonLoader
            loader={<GraphGreyIcon />}
            text={lang.strings.portfolio.accountMissing.text}
            subText={lang.strings.portfolio.accountMissing.subText}
            $buttonOne={lang.strings.buttons.addAccount}
            onClick={handleAddAccountClick}
            $noLoaderContainer
          />
        </NoAccountWrapper>
      );
    }

    return <PortfolioPageContent />;
  };

  return (
    <MainAppLayout topbar={{ title: lang.strings.portfolio.title }}>
      <Container $noFlex m="20">
        {getMainContent()}
      </Container>
    </MainAppLayout>
  );
};
