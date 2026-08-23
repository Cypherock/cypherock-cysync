import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { Button, Flex, Typography } from '@cypherock/cysync-ui';
import React, { useMemo } from 'react';

import { CoinIcon } from '~/components';
import { useAccounts, useNavigateTo } from '~/hooks';
import { EVERSTAKE_ASSETS } from '~/constants/everstake';
import { routes } from '~/constants';
import {
  selectCurrentCurrencyPriceInfos,
  selectWallets,
  useAppSelector,
} from '~/store';
import { useCurrency } from '~/context';

import { MainAppLayout } from '../Layout';

const COL = {
  account: 1,
  wallet: 1,
  balance: 1,
  actions: 1,
};

const HEADER_COLS = [
  { label: 'Account', flex: COL.account },
  { label: 'Wallet', flex: COL.wallet },
  { label: 'Balance', flex: COL.balance },
  { label: 'Actions', flex: COL.actions },
];

const Cell: React.FC<{
  flex: number;
  children: React.ReactNode;
  align?: 'flex-start' | 'center' | 'flex-end';
}> = ({ flex, children, align = 'flex-start' }) => (
  <Flex
    direction="column"
    justify="center"
    align={align}
    $flex={flex}
    p="0 20px"
    gap={5}
  >
    {children}
  </Flex>
);

Cell.defaultProps = { align: 'flex-start' };

export const EarnDashboard: React.FC = () => {
  const navigateTo = useNavigateTo();
  const accounts = useAccounts();
  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );
  const { wallets } = useAppSelector(selectWallets);

  const stakeableRows = useMemo(
    () =>
      accounts.flatMap(account => {
        const cfg = EVERSTAKE_ASSETS.find(
          s =>
            s.assetId === account.assetId &&
            s.parentAssetId === account.parentAssetId,
        );
        if (!cfg) return [];
        const wallet = wallets.find(w => w.__id === account.walletId);
        return [{ account, cfg, walletName: wallet?.name ?? '' }];
      }),
    [accounts, wallets],
  );

  const formatBalance = (
    account: (typeof stakeableRows)[0]['account'],
  ): { token: string; usd: string } => {
    try {
      const { amount, unit } = getParsedAmount({
        coinId: account.parentAssetId,
        assetId: account.assetId,
        unitAbbr: getDefaultUnit(account.parentAssetId, account.assetId).abbr,
        amount: account.balance,
      });
      const priceInfo = priceInfos.find(p => p.assetId === account.assetId);
      const usdVal = priceInfo
        ? (parseFloat(amount) * parseFloat(priceInfo.latestPrice)).toFixed(2)
        : undefined;
      return {
        token: `${parseFloat(parseFloat(amount).toFixed(6))} ${unit.abbr}`,
        usd: usdVal !== undefined ? `$${usdVal}` : '',
      };
    } catch {
      return { token: account.balance, usd: '' };
    }
  };

  return (
    <MainAppLayout topbar={{ title: 'Earn' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          minHeight: '100%',
          width: '100%',
          background:
            'linear-gradient(89.76deg, #16120F 0.23%, #1F1915 99.82%)',
          padding: 40,
          boxSizing: 'border-box',
        }}
      >
        {stakeableRows.length === 0 ? (
          <Typography variant="p" color="muted">
            No stakeable accounts found. Add an Ethereum account (and, for POL
            staking, add POL as a token to it) to get started.
          </Typography>
        ) : (
          <Flex direction="column" gap={12} width="full">
            <Typography variant="h5" color="muted">
              Available assets
            </Typography>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                border: '1px solid #44383080',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  padding: '16px 0',
                  background: '#27221d',
                  borderBottom: '1px solid #44383080',
                }}
              >
                {HEADER_COLS.map(col => (
                  <div
                    key={col.label}
                    style={{
                      display: 'flex',
                      flex: col.flex,
                      padding: '0 20px',
                      justifyContent:
                        col.label === 'Actions' ? 'center' : undefined,
                    }}
                  >
                    <Typography variant="span" color="muted" $fontSize={13}>
                      {col.label}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {stakeableRows.map(({ account, cfg, walletName }, index) => {
                const { token, usd } = formatBalance(account);
                const isEven = index % 2 === 0;
                const isLast = index === stakeableRows.length - 1;

                return (
                  <div
                    key={account.__id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      minHeight: 72,
                      background: isEven
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* Account */}
                    <Cell flex={COL.account}>
                      <Flex direction="row" align="center" gap={12}>
                        <CoinIcon
                          parentAssetId={account.parentAssetId}
                          assetId={account.assetId}
                          size="28px"
                        />
                        <Flex direction="column" gap={4}>
                          <Typography variant="span" $fontSize={16}>
                            {account.name}
                          </Typography>
                          <Typography
                            variant="span"
                            color="muted"
                            $fontSize={13}
                          >
                            {cfg.label}
                          </Typography>
                        </Flex>
                      </Flex>
                    </Cell>

                    {/* Wallet */}
                    <Cell flex={COL.wallet}>
                      <Typography variant="span" $fontSize={16}>
                        {walletName}
                      </Typography>
                    </Cell>

                    {/* Balance */}
                    <Cell flex={COL.balance}>
                      <Typography variant="span" $fontSize={16}>
                        {token}
                      </Typography>
                      {usd ? (
                        <Typography variant="span" color="muted" $fontSize={13}>
                          {usd}
                        </Typography>
                      ) : null}
                    </Cell>

                    {/* Actions */}
                    <Cell flex={COL.actions} align="center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          navigateTo(
                            `${routes.everstakeAccount.path}?accountId=${account.__id}`,
                          );
                        }}
                      >
                        Manage
                      </Button>
                    </Cell>
                  </div>
                );
              })}
            </div>
          </Flex>
        )}
      </div>
    </MainAppLayout>
  );
};
