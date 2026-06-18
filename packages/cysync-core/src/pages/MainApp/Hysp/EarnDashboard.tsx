import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import {
  Button,
  Flex,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import React, { useEffect, useMemo, useState } from 'react';

import { openHyspDialog } from '~/actions';
import { CoinIcon } from '~/components';
import { useAccounts } from '~/hooks';
import { MIDAS_BLOCKED_COUNTRIES, STAKEABLE_ASSETS } from '~/constants/hysp';
import * as hyspService from '~/services/hyspService';
import {
  selectCountry,
  selectCurrentCurrencyPriceInfos,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { useCurrency } from '~/context';

import { MainAppLayout } from '../Layout';

const COL = {
  account: 1,
  wallet:  1,
  balance: 1,
  apy:     1,
  vault:   1,
  actions: 1,
};

const HEADER_COLS = [
  { label: 'Account', flex: COL.account },
  { label: 'Wallet',  flex: COL.wallet },
  { label: 'Balance', flex: COL.balance },
  { label: 'APY',     flex: COL.apy },
  { label: 'Vault',   flex: COL.vault },
  { label: 'Actions', flex: COL.actions },
];

const Cell: React.FC<{
  flex: number;
  children: React.ReactNode;
  align?: 'flex-start' | 'center' | 'flex-end';
}> = ({ flex, children, align = 'flex-start' }) => (
  <div
    style={{
      flex,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: align,
      padding: '0 20px',
      gap: 5,
    }}
  >
    {children}
  </div>
);

// ─── Number style for summary cards ──────────────────────────────────────────
const bigNumber = (color = '#FFFFFF'): React.CSSProperties => ({
  fontFamily: 'Poppins',
  fontWeight: 700,
  fontSize: 38,
  lineHeight: 1,
  color,
  letterSpacing: 0,
});

export const EarnDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const accounts = useAccounts();
  const { countryCode } = useAppSelector(selectCountry);
  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );
  const { wallets } = useAppSelector(selectWallets);

  const [midasApy, setMidasApy] = useState<number | undefined>();
  const [apyLoading, setApyLoading] = useState(true);

  useEffect(() => {
    setApyLoading(true);
    hyspService
      .getVaultInfo('eth_mainnet', countryCode)
      .then(info => {
        setMidasApy(info.apy);
        setApyLoading(false);
      })
      .catch(() => {
        setMidasApy(undefined);
        setApyLoading(false);
      });
  }, [countryCode]);

  const isMidasBlocked =
    !!countryCode &&
    MIDAS_BLOCKED_COUNTRIES.includes(countryCode.toUpperCase());

  const stakeableRows = useMemo(
    () =>
      accounts
        .filter(a => a.type === AccountTypeMap.subAccount)
        .flatMap(account => {
          const cfg = STAKEABLE_ASSETS.find(
            s =>
              s.assetId === account.assetId &&
              s.parentAssetId === account.parentAssetId,
          );
          if (!cfg) return [];
          if (cfg.geoblocked && isMidasBlocked) return [];
          const wallet = wallets.find(w => w.__id === account.walletId);
          return [{ account, cfg, walletName: wallet?.name ?? '' }];
        }),
    [accounts, isMidasBlocked, wallets],
  );

  const formatTokenBalance = (
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
        token: `${amount} ${unit.abbr}`,
        usd: usdVal !== undefined ? `$${usdVal}` : '',
      };
    } catch {
      return { token: account.balance, usd: '' };
    }
  };

  const totalUsdValue = useMemo(() => {
    let total = 0;
    for (const { account } of stakeableRows) {
      const priceInfo = priceInfos.find(p => p.assetId === account.assetId);
      if (!priceInfo) continue;
      try {
        const { amount } = getParsedAmount({
          coinId: account.parentAssetId,
          assetId: account.assetId,
          unitAbbr: getDefaultUnit(account.parentAssetId, account.assetId).abbr,
          amount: account.balance,
        });
        total += parseFloat(amount) * parseFloat(priceInfo.latestPrice);
      } catch {
        // skip
      }
    }
    return total;
  }, [stakeableRows, priceInfos]);

  const estimatedYearlyRewards = useMemo(() => {
    if (!midasApy) return 0;
    return totalUsdValue * (midasApy / 100);
  }, [totalUsdValue, midasApy]);

  return (
    <MainAppLayout topbar={{ title: 'Earn' }}>
      <div
        style={{
          minHeight: '100%',
          width: '100%',
          background: 'linear-gradient(89.76deg, #16120F 0.23%, #1F1915 99.82%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          padding: 40,
          boxSizing: 'border-box',
        }}
      >
        {/* ── Summary cards ───────────────────────────────────────────── */}
        <Flex direction="row" gap={16} width="full">
          {/* Amount available */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 28,
              borderRadius: 12,
              borderTop: '1px solid #44383080',
              background: '#29252466',
            }}
          >
            <Typography variant="p" color="muted">
              Amount available to earn
            </Typography>
            <span style={bigNumber()}>${totalUsdValue.toFixed(2)}</span>
            <Typography variant="span" color="muted" $fontSize={13}>
              All of your stakeable assets from your portfolio
            </Typography>
          </div>

          {/* Yearly rewards */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 28,
              borderRadius: 12,
              borderTop: '1px solid #44383080',
              background: '#29252466',
            }}
          >
            <Typography variant="p" color="muted">
              Rewards you could earn
            </Typography>
            {apyLoading ? (
              <Throbber size={28} strokeWidth={2} />
            ) : (
              <span style={bigNumber('#51c61a')}>
                ${estimatedYearlyRewards.toFixed(2)}
              </span>
            )}
            {!apyLoading && midasApy !== undefined && (
              <Typography variant="p" color="muted">
                Per year · {midasApy.toFixed(2)}% APY
              </Typography>
            )}
          </div>
        </Flex>

        {/* ── Assets table ────────────────────────────────────────────── */}
        {stakeableRows.length === 0 ? (
          <Typography variant="p" color="muted">
            {isMidasBlocked
              ? 'Earn is not available in your region.'
              : 'No supported assets found. Add a USDC or USDT account on ETH or Base to get started.'}
          </Typography>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Typography variant="h5" color="muted">Available assets</Typography>

            {/* Table card */}
            <div
              style={{
                width: '100%',
                border: '1px solid #44383080',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Header row */}
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
                      flex: col.flex,
                      padding: '0 20px',
                      ...(col.label === 'Actions' && {
                        display: 'flex',
                        justifyContent: 'center',
                      }),
                    }}
                  >
                    <Typography variant="span" color="muted" $fontSize={20}>
                      {col.label}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {stakeableRows.map(({ account, cfg, walletName }, index) => {
                const { token, usd } = formatTokenBalance(account);
                const apy =
                  midasApy !== undefined ? `${midasApy.toFixed(2)}%` : '—';
                const vaultLabel =
                  cfg.protocol === 'midas' ? 'Midas Vault' : 'Kamino Vault';
                const tokenSymbol = account.assetId.includes('tether')
                  ? 'usdt'
                  : 'usdc';
                const chainLabel =
                  account.parentAssetId.charAt(0).toUpperCase() +
                  account.parentAssetId.slice(1);
                const isEven = index % 2 === 0;
                const isLast = index === stakeableRows.length - 1;

                return (
                  <div
                    key={account.__id}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      minHeight: 100,
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
                          <Typography variant="span" $fontSize={21}>
                            {account.name}
                          </Typography>
                          <Typography
                            variant="span"
                            color="muted"
                            $fontSize={18}
                          >
                            {chainLabel}
                          </Typography>
                        </Flex>
                      </Flex>
                    </Cell>

                    {/* Wallet */}
                    <Cell flex={COL.wallet}>
                      <Typography variant="span" $fontSize={21}>
                        {walletName}
                      </Typography>
                    </Cell>

                    {/* Balance */}
                    <Cell flex={COL.balance}>
                      <Typography variant="span" $fontSize={21}>
                        {token}
                      </Typography>
                      {usd ? (
                        <Typography
                          variant="span"
                          color="muted"
                          $fontSize={18}
                        >
                          {usd}
                        </Typography>
                      ) : null}
                    </Cell>

                    {/* APY */}
                    <Cell flex={COL.apy}>
                      {apyLoading ? (
                        <Throbber size={18} strokeWidth={2} />
                      ) : (
                        <>
                          <Typography variant="span" $fontSize={21}>
                            {apy}
                          </Typography>
                          <Typography
                            variant="span"
                            color="muted"
                            $fontSize={18}
                          >
                            APY
                          </Typography>
                        </>
                      )}
                    </Cell>

                    {/* Vault */}
                    <Cell flex={COL.vault}>
                      <Typography variant="span" $fontSize={21}>
                        {vaultLabel}
                      </Typography>
                    </Cell>

                    {/* Actions */}
                    <Cell flex={COL.actions} align="center">
                      <Button
                        variant="primary"
                        size="lg"
                        style={{ padding: '12px 48px' }}
                        onClick={() => {
                          dispatch(
                            openHyspDialog(
                              account.parentAccountId,
                              tokenSymbol,
                              account.walletId,
                            ),
                          );
                        }}
                      >
                        Earn
                      </Button>
                    </Cell>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MainAppLayout>
  );
};
