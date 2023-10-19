import {
  Container,
  GraphGreyIcon,
  NoAccountWrapper,
  SkeletonLoader,
  Typography,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, lazy, Suspense } from 'react';
import { openAddAccountDialog } from '~/actions';

import {
  useAppSelector,
  selectLanguage,
  selectAccounts,
  selectWallets,
  useAppDispatch,
} from '~/store';

import { MainAppLayout } from '../Layout';
import { NoWallet } from './NoWallet';

const PortfolioPageContent = lazy(() => import('./Content.js'));

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

    return (
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <PortfolioPageContent />
      </Suspense>
    );
  };

  return (
    <MainAppLayout topbar={{ title: lang.strings.portfolio.title }}>
      <Container $noFlex m="20">
        {getMainContent()}
      </Container>
    </MainAppLayout>
  );
};
