import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ArrowBackGoldenIcon,
  ArrowReceivedIcon,
  ArrowRightIcon,
  ArrowSentIcon,
  Button,
  ClockIcon,
  EverstakeLogo,
  Flex,
  GraphIcon,
  HourglassIcon,
  InformationIcon,
  Throbber,
  Typography,
  WalletIconRounded,
} from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { openEverstakeDialog } from '~/actions';
import { CoinIcon } from '~/components';
import { useCurrency } from '~/context';
import { useAccounts, useNavigateTo } from '~/hooks';
import * as everstakeService from '~/services/everstakeService';
import {
  selectCurrentCurrencyPriceInfos,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { routes } from '~/constants';

import { MainAppLayout } from '../Layout';

type WithStyle<T> = T & { style?: React.CSSProperties };
const F = Flex as React.ComponentType<
  WithStyle<React.ComponentProps<typeof Flex>>
>;
const T = Typography as React.ComponentType<
  WithStyle<React.ComponentProps<typeof Typography>>
>;

// Shared

const DIVIDER_STYLE: React.CSSProperties = {
  borderTop: '0.5px solid rgba(68,56,48,0.5)',
};

const iconBg = (disabled?: boolean): React.CSSProperties => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  background: disabled ? 'rgba(68,56,48,0.25)' : 'rgba(196,146,42,0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

// Metric card

const MetricCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  green?: boolean;
  icon: React.ReactNode;
}> = ({ label, value, sub, green, icon }) => (
  <F
    direction="column"
    gap={10}
    style={{
      background: '#1A1612',
      border: '1px solid rgba(68,56,48,0.6)',
      borderRadius: 12,
      padding: '16px 18px',
      flex: 1,
    }}
  >
    <Flex align="center" gap={7}>
      {icon}
      <T
        variant="span"
        color="muted"
        style={{ fontSize: 13, fontFamily: 'Poppins' }}
      >
        {label}
      </T>
    </Flex>
    <T
      variant="span"
      style={{
        fontSize: 20,
        fontWeight: 500,
        color: green ? '#4CAF7D' : '#FFFFFF',
        fontFamily: 'Poppins',
        lineHeight: 1.2,
      }}
    >
      {value}
    </T>
    {sub && (
      <T
        variant="span"
        style={{ fontSize: 12, color: '#5C5855', fontFamily: 'Poppins' }}
      >
        {sub}
      </T>
    )}
  </F>
);

MetricCard.defaultProps = { sub: undefined, green: false };

// Action card

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  disabled?: boolean;
  primary?: boolean;
  onClick?: () => void;
}> = ({
  icon,
  title,
  description,
  buttonLabel,
  disabled,
  primary,
  onClick,
}) => (
  <F
    direction="column"
    gap={12}
    style={{
      background: '#1A1612',
      border: `1px solid ${
        disabled ? 'rgba(68,56,48,0.3)' : 'rgba(68,56,48,0.6)'
      }`,
      borderRadius: 14,
      padding: '20px 22px',
      flex: 1,
      opacity: disabled ? 0.45 : 1,
    }}
  >
    <Flex align="center" gap={12}>
      <div style={iconBg(disabled)}>{icon}</div>
      <T
        variant="span"
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: '#FFFFFF',
          fontFamily: 'Poppins',
        }}
      >
        {title}
      </T>
    </Flex>
    <T
      variant="span"
      style={{
        fontSize: 14,
        color: '#8B8682',
        lineHeight: 1.65,
        fontFamily: 'Poppins',
        flex: 1,
      }}
    >
      {description}
    </T>
    <Button
      variant={primary ? 'primary' : 'secondary'}
      disabled={disabled}
      onClick={onClick}
      style={{ alignSelf: 'flex-start', marginTop: 4 }}
    >
      {buttonLabel}
    </Button>
  </F>
);

ActionCard.defaultProps = {
  disabled: false,
  primary: false,
  onClick: undefined,
};

// Flow diagram

interface FlowNode {
  label: string;
  icon: React.ReactNode;
  dashed?: boolean;
}

const FlowDiagram: React.FC<{ title: string; nodes: FlowNode[] }> = ({
  title,
  nodes,
}) => (
  <Flex direction="column" gap={10}>
    <T
      variant="span"
      style={{
        fontFamily: 'Poppins',
        fontSize: 13,
        fontWeight: 500,
        color: '#8B8682',
      }}
    >
      {title}
    </T>
    <Flex align="center" gap={6} $flexWrap="wrap">
      {nodes.map((node, i) => (
        <React.Fragment key={node.label}>
          <F
            align="center"
            gap={7}
            style={{
              background: '#1A1612',
              border: `1px ${node.dashed ? 'dashed' : 'solid'} rgba(68,56,48,${
                node.dashed ? '0.5' : '0.7'
              })`,
              borderRadius: 8,
              padding: '7px 13px',
              opacity: node.dashed ? 0.7 : 1,
            }}
          >
            {node.icon}
            <T
              variant="span"
              style={{
                fontFamily: 'Poppins',
                fontSize: 13,
                color: node.dashed ? '#8B8682' : '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </T>
          </F>
          {i < nodes.length - 1 && <ArrowRightIcon width={10} height={10} />}
        </React.Fragment>
      ))}
    </Flex>
  </Flex>
);

// Info strip

const InfoStrip: React.FC<{
  items: { icon: React.ReactNode; title: string; body: string }[];
}> = ({ items }) => (
  <F
    align="stretch"
    style={{
      background: '#1A1612',
      border: '1px solid rgba(68,56,48,0.6)',
      borderRadius: 12,
    }}
  >
    {items.map((item, i) => (
      <React.Fragment key={item.title}>
        <F
          align="flex-start"
          gap={12}
          style={{ flex: 1, padding: '16px 20px' }}
        >
          <div style={{ marginTop: 1, flexShrink: 0 }}>{item.icon}</div>
          <Flex direction="column" gap={4}>
            <T
              variant="span"
              style={{
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: 500,
                color: '#FFFFFF',
              }}
            >
              {item.title}
            </T>
            <T
              variant="span"
              style={{
                fontFamily: 'Poppins',
                fontSize: 13,
                color: '#8B8682',
                lineHeight: 1.6,
              }}
            >
              {item.body}
            </T>
          </Flex>
        </F>
        {i < items.length - 1 && (
          <div
            style={{
              width: '0.5px',
              background: 'rgba(68,56,48,0.5)',
              flexShrink: 0,
            }}
          />
        )}
      </React.Fragment>
    ))}
  </F>
);

// Helpers

// Note: Values from server are already in ETH
const parseEth = (ethAmount: string): string => {
  if (!ethAmount || ethAmount === '0') return '0 ETH';
  try {
    const trimmed = parseFloat(parseFloat(ethAmount).toFixed(6)).toString();
    return `${trimmed} ETH`;
  } catch {
    return '0 ETH';
  }
};

// Page

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

  const [position, setPosition] = useState<
    everstakeService.IEverstakeUserPosition | undefined
  >(undefined);
  const [withdrawRequest, setWithdrawRequest] = useState<
    everstakeService.IEverstakeWithdrawRequest | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account?.xpubOrAddress) return;
    setLoading(true);
    Promise.all([
      everstakeService.getUserPosition(account.xpubOrAddress),
      everstakeService.getWithdrawRequest(account.xpubOrAddress),
    ])
      .then(([pos, wr]) => {
        setPosition(pos);
        setWithdrawRequest(wr);
      })
      .finally(() => setLoading(false));
  }, [account?.xpubOrAddress]);

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

  const ethPrice = priceInfos.find(pr => pr.assetId === a)?.latestPrice;
  const toUsd = (eth: string): string => {
    const num = eth.split(' ')[0];
    if (!ethPrice || !num || num === '0') return '';
    const val = new BigNumber(num).multipliedBy(ethPrice);
    return val.isNaN() ? '' : `$${val.toFixed(2)}`;
  };

  // pendingDepositedBalanceOf = ETH staked but not yet active (processing queue)
  // autocompoundBalanceOf     = total active stake (principal + compounded rewards)
  // depositedBalanceOf        = principal portion of active stake (no rewards)
  // pendingRestakedRewardOf   = rewards being restaked (pending)
  const deposited = position ? parseEth(position.autocompoundBalanceOf) : '–';
  const rewards = position
    ? (() => {
        const val = new BigNumber(position.pendingRestakedRewardOf || '0');
        return parseEth(val.isGreaterThan(0) ? val.toFixed(10) : '0');
      })()
    : '–';
  const pending = position ? parseEth(position.pendingDepositedBalanceOf) : '–';
  const queueVal = withdrawRequest
    ? new BigNumber(withdrawRequest.requested)
        .minus(new BigNumber(withdrawRequest.readyForClaim))
        .toFixed(6)
    : '0';
  const queue = withdrawRequest ? parseEth(queueVal) : '–';
  const claimable = withdrawRequest
    ? parseEth(withdrawRequest.readyForClaim)
    : '–';

  const hasStaked = position
    ? new BigNumber(position.autocompoundBalanceOf).isGreaterThan(0)
    : false;
  const hasClaimable = withdrawRequest
    ? new BigNumber(withdrawRequest.readyForClaim).isGreaterThan(0)
    : false;

  const openDialog = (mode: 'stake' | 'unstake' | 'claim') => {
    dispatch(
      openEverstakeDialog({
        initialAccountId: account.__id,
        initialWalletId: account.walletId,
        initialMode: mode,
      }),
    );
  };

  const stakingNodes: FlowNode[] = [
    {
      label: 'Your wallet',
      icon: <WalletIconRounded width={14} height={12} />,
    },
    {
      label: 'Stake',
      icon: <ArrowSentIcon width={14} height={12} fill="#C4922A" />,
    },
    {
      label: 'Pending deposit',
      icon: <ClockIcon width={13} height={13} />,
      dashed: true,
    },
    {
      label: 'Actively staked',
      icon: <ArrowSentIcon width={14} height={12} fill="#4CAF7D" />,
    },
    {
      label: 'Rewards',
      icon: <GraphIcon width={16} height={8} />,
      dashed: true,
    },
  ];

  const unstakingNodes: FlowNode[] = [
    {
      label: 'Actively staked',
      icon: <ArrowSentIcon width={14} height={12} fill="#C4922A" />,
    },
    {
      label: 'Unstake',
      icon: <ArrowReceivedIcon width={14} height={12} fill="#C4922A" />,
    },
    {
      label: 'Unstake queue',
      icon: <HourglassIcon width={11} height={13} />,
      dashed: true,
    },
    {
      label: 'Ready to claim',
      icon: <ArrowReceivedIcon width={14} height={12} fill="#4CAF7D" />,
    },
    {
      label: 'Your wallet',
      icon: <WalletIconRounded width={14} height={12} />,
    },
  ];

  const infoItems = [
    {
      icon: <HourglassIcon width={15} height={17} />,
      title: 'Unstaking period',
      body: 'ETH enters a queue after unstaking and becomes claimable once processed by Everstake.',
    },
    {
      icon: <InformationIcon width={17} height={17} />,
      title: 'Non-custodial',
      body: 'Everstake uses non-custodial smart contracts. You retain full control of your assets at all times.',
    },
    {
      icon: <GraphIcon width={20} height={10} />,
      title: 'Autocompounding',
      body: 'Rewards are automatically compounded back into your position, growing your staked balance over time.',
    },
  ];

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
          <Flex direction="row" align="center" gap={16}>
            <CoinIcon parentAssetId={p} assetId={a} size="48px" />
            <Flex direction="column" gap={4}>
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
            </Flex>
          </Flex>

          <Flex direction="column" align="flex-end" gap={4}>
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
          </Flex>
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

        {/* ── Position ── */}
        <div>
          <T
            variant="span"
            style={{
              fontFamily: 'Poppins',
              fontSize: 12,
              fontWeight: 500,
              color: '#8B8682',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 16,
              display: 'block',
            }}
          >
            Your position
          </T>
          {loading ? (
            <Flex align="center" gap={10}>
              <Throbber size={18} strokeWidth={2} />
              <T
                variant="span"
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  color: '#8B8682',
                }}
              >
                Loading position...
              </T>
            </Flex>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              <MetricCard
                label="Actively staked"
                value={deposited}
                sub={toUsd(deposited) || undefined}
                green
                icon={<ArrowSentIcon width={13} height={12} fill="#4CAF7D" />}
              />
              <MetricCard
                label="Rewards"
                value={rewards}
                sub={toUsd(rewards) || undefined}
                green
                icon={<GraphIcon width={14} height={8} />}
              />
              <MetricCard
                label="Pending deposit"
                value={pending}
                sub="Entering pool"
                icon={<ClockIcon width={13} height={13} />}
              />
              <MetricCard
                label="Unstaking queue"
                value={queue}
                sub="Processing"
                icon={<HourglassIcon width={11} height={13} />}
              />
              <MetricCard
                label="Ready to claim"
                value={claimable}
                sub={hasClaimable ? 'Available now' : undefined}
                icon={<WalletIconRounded width={14} height={12} />}
              />
            </div>
          )}
        </div>

        <div style={DIVIDER_STYLE} />

        {/* ── Actions ── */}
        <div>
          <T
            variant="span"
            style={{
              fontFamily: 'Poppins',
              fontSize: 12,
              fontWeight: 500,
              color: '#8B8682',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 16,
              display: 'block',
            }}
          >
            Actions
          </T>
          <Flex gap={12}>
            <ActionCard
              icon={<ArrowSentIcon width={18} height={16} fill="#C4922A" />}
              title="Stake"
              description="Send ETH into the Everstake pool to start earning staking rewards."
              buttonLabel="Stake ETH"
              primary
              onClick={() => openDialog('stake')}
            />
            <ActionCard
              icon={
                <ArrowReceivedIcon
                  width={18}
                  height={16}
                  fill={!hasStaked ? '#8B8682' : '#C4922A'}
                />
              }
              title="Unstake"
              description="Withdraw ETH from your staked position. Enters a processing queue before becoming claimable."
              buttonLabel="Unstake ETH"
              disabled={!hasStaked}
              onClick={() => openDialog('unstake')}
            />
            <ActionCard
              icon={<WalletIconRounded width={18} height={16} />}
              title="Claim"
              description="Move unstaked ETH that has cleared the queue back to your wallet."
              buttonLabel={
                hasClaimable ? `Claim ${claimable}` : 'Nothing to claim'
              }
              disabled={!hasClaimable}
              onClick={() => openDialog('claim')}
            />
          </Flex>
        </div>

        <div style={DIVIDER_STYLE} />

        {/* ── How it works ── */}
        <div>
          <T
            variant="span"
            style={{
              fontFamily: 'Poppins',
              fontSize: 12,
              fontWeight: 500,
              color: '#8B8682',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 16,
              display: 'block',
            }}
          >
            How it works
          </T>
          <F direction="column" gap={16} style={{ marginBottom: 20 }}>
            <FlowDiagram title="Staking" nodes={stakingNodes} />
            <FlowDiagram title="Unstaking" nodes={unstakingNodes} />
          </F>
          <InfoStrip items={infoItems} />
        </div>
      </F>
    </MainAppLayout>
  );
};
