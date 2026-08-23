import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import {
  ArrowBackGoldenIcon,
  EverstakeLogo,
  Typography,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { openEverstakeDialog } from '~/actions';
import { CoinIcon } from '~/components';
import { routes } from '~/constants';
import { EVERSTAKE_ASSETS } from '~/constants/everstake';
import { useCurrency } from '~/context';
import { EverstakeMode } from '~/context/everstake';
import { useEverstakePosition } from '~/context/everstake/core/useEverstakePosition';
import { useAccounts, useNavigateTo } from '~/hooks';
import {
  selectAccountSync,
  selectCurrentCurrencyPriceInfos,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import logger from '~/utils/logger';

import { DIVIDER_STYLE, F, T } from './components/EverstakeAccountShared';
import { EthAccountPageContent } from './eth/EthAccountPageContent';
import { PolAccountPageContent } from './pol/PolAccountPageContent';

import { MainAppLayout } from '../Layout';

export const EverstakeAccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigateTo = useNavigateTo();
  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const accountId = query.get('accountId') ?? undefined;

  const accounts = useAccounts();
  const { wallets } = useAppSelector(selectWallets);
  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const account = useMemo(
    () => accounts.find(a => a.__id === accountId),
    [accounts, accountId],
  );
  const wallet = useMemo(
    () => wallets.find(w => w.__id === account?.walletId),
    [wallets, account],
  );

  const assetConfig = useMemo(
    () =>
      EVERSTAKE_ASSETS.find(
        cfg =>
          account &&
          cfg.assetId === account.assetId &&
          cfg.parentAssetId === account.parentAssetId,
      ),
    [account],
  );
  const isPol = assetConfig?.kind === 'pol';

  const {
    userPosition,
    withdrawRequest,
    polPosition,
    dataLoading,
    setDataLoading,
    refreshPosition,
  } = useEverstakePosition({ selectedAccount: account, isPol });

  const { lastSyncedAt } = useAppSelector(selectAccountSync);

  useEffect(() => {
    if (!account) return;
    setDataLoading(true);
    refreshPosition(account)
      .catch((e: any) =>
        logger.error(
          'Everstake post-sync position refresh failed',
          e as object,
        ),
      )
      .finally(() => setDataLoading(false));
  }, [lastSyncedAt]);

  if (!account) {
    return (
      <MainAppLayout topbar={{ title: 'Earn' }}>
        <F
          style={{
            padding: 40,
            background:
              'linear-gradient(89.76deg, #16120F 0.23%, #1F1915 99.82%)',
            minHeight: '100%',
          }}
        >
          <Typography variant="p" color="muted">
            Account not found.
          </Typography>
        </F>
      </MainAppLayout>
    );
  }

  const p = account.parentAssetId;
  const a = account.assetId;
  const unitAbbr = (() => {
    try {
      return getDefaultUnit(p, a).abbr;
    } catch {
      return isPol ? 'POL' : 'ETH';
    }
  })();

  const availableBalance = (() => {
    try {
      const { amount, unit } = getParsedAmount({
        coinId: p,
        assetId: a,
        unitAbbr: getDefaultUnit(p, a).abbr,
        amount: account.balance,
      });
      return `${parseFloat(parseFloat(amount).toFixed(6))} ${unit.abbr}`;
    } catch {
      return account.balance;
    }
  })();

  const assetPrice = priceInfos.find(pr => pr.assetId === a)?.latestPrice;
  const toUsd = (displayAmount: string): string => {
    const num = displayAmount.split(' ')[0];
    if (!assetPrice || !num || num === '0') return '';
    const val = new BigNumber(num).multipliedBy(assetPrice);
    return val.isNaN() ? '' : `$${val.toFixed(2)}`;
  };

  const openDialog = (dialogMode: EverstakeMode) => {
    dispatch(
      openEverstakeDialog({
        initialAccountId: account.__id,
        initialWalletId: account.walletId,
        initialMode: dialogMode,
      }),
    );
  };

  return (
    <MainAppLayout topbar={{ title: 'Earn' }}>
      <F
        direction="column"
        gap={28}
        style={{
          minHeight: '100%',
          width: '100%',
          background:
            'linear-gradient(89.76deg, #16120F 0.23%, #1F1915 99.82%)',
          padding: '32px 40px 48px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* ── Back ── */}
        <button
          type="button"
          onClick={() => navigateTo(routes.earn.path)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8B8682',
            fontSize: 14,
            fontFamily: 'Poppins',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
            alignSelf: 'flex-start',
          }}
        >
          <ArrowBackGoldenIcon width={14} height={14} />
          Back to Earn
        </button>

        {/* ── Account header ── */}
        <F
          align="center"
          justify="space-between"
          style={{
            background: '#1A1612',
            border: '1px solid rgba(68,56,48,0.6)',
            borderRadius: 14,
            padding: '22px 26px',
          }}
        >
          <F direction="row" align="center" gap={16}>
            <CoinIcon parentAssetId={p} assetId={a} size="48px" />
            <F direction="column" gap={4}>
              <T
                variant="span"
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 21,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                }}
              >
                {account.name}
              </T>
              <T
                variant="span"
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  color: '#8B8682',
                }}
              >
                from wallet{' '}
                <span style={{ color: '#CCC4BE' }}>{wallet?.name ?? ''}</span>
              </T>
            </F>
          </F>

          <F direction="column" align="flex-end" gap={4}>
            <T
              variant="span"
              style={{ fontFamily: 'Poppins', fontSize: 13, color: '#8B8682' }}
            >
              Available balance
            </T>
            <T
              variant="span"
              style={{
                fontFamily: 'Poppins',
                fontSize: 20,
                fontWeight: 500,
                color: '#FFFFFF',
              }}
            >
              {availableBalance}
            </T>
            {toUsd(availableBalance) ? (
              <T
                variant="span"
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 13,
                  color: '#8B8682',
                }}
              >
                {toUsd(availableBalance)}
              </T>
            ) : undefined}
          </F>
        </F>

        {/* ── Powered by ── */}
        <F align="center" justify="flex-end" gap={6} style={{ marginTop: -16 }}>
          <T
            variant="span"
            style={{ fontFamily: 'Poppins', fontSize: 12, color: '#5C5855' }}
          >
            Powered by
          </T>
          <EverstakeLogo width={64} height={11} />
        </F>

        <div style={DIVIDER_STYLE} />

        {isPol ? (
          <PolAccountPageContent
            unitAbbr={unitAbbr}
            loading={dataLoading}
            polPosition={polPosition}
            openDialog={openDialog}
          />
        ) : (
          <EthAccountPageContent
            unitAbbr={unitAbbr}
            toUsd={toUsd}
            loading={dataLoading}
            position={userPosition}
            withdrawRequest={withdrawRequest}
            openDialog={openDialog}
          />
        )}
      </F>
    </MainAppLayout>
  );
};
