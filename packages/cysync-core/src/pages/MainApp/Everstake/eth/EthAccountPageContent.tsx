import {
  ArrowReceivedIcon,
  ArrowSentIcon,
  ClockIcon,
  GraphIcon,
  HourglassIcon,
  InformationIcon,
  Throbber,
  WalletIconRounded,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React from 'react';

import { EverstakeMode } from '~/context/everstake';
import * as everstakeEthService from '~/services/everstakeEthService';

import {
  ActionCard,
  DIVIDER_STYLE,
  F,
  FlowDiagram,
  FlowNode,
  InfoStrip,
  MetricCard,
  parseAmount,
  SECTION_LABEL_STYLE,
  T,
} from '../components/EverstakeAccountShared';

const STAKING_NODES: FlowNode[] = [
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

const UNSTAKING_NODES: FlowNode[] = [
  {
    label: 'Actively staked',
    icon: <ArrowSentIcon width={14} height={12} fill="#C4922A" />,
  },
  {
    label: 'Unstake',
    icon: <ArrowReceivedIcon width={14} height={12} fill="#C4922A" />,
  },
  {
    label: 'Your wallet',
    icon: <WalletIconRounded width={14} height={12} />,
  },
];

const INFO_ITEMS = [
  {
    icon: <HourglassIcon width={15} height={17} />,
    title: 'Unstaking period',
    body: 'ETH is returned instantly if pool liquidity allows, otherwise enters a queue before becoming claimable.',
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

const toDisplayAmount = (
  value: string | undefined,
  hasData: boolean,
  unitAbbr: string,
) => (hasData ? parseAmount(value as string, unitAbbr) : '–');

const isPositive = (value: string | undefined) =>
  value !== undefined && new BigNumber(value).isGreaterThan(0);

const getRewardsValue = (pendingRestakedRewardOf: string) => {
  const val = new BigNumber(pendingRestakedRewardOf || '0');
  return val.isGreaterThan(0) ? val.toFixed(10) : '0';
};

const getQueueValue = (requested: string, readyForClaim: string) =>
  new BigNumber(requested).minus(new BigNumber(readyForClaim)).toFixed(6);

const getEthAmounts = (
  position: everstakeEthService.IEverstakeUserPosition | undefined,
  withdrawRequest: everstakeEthService.IEverstakeWithdrawRequest | undefined,
  unitAbbr: string,
) => ({
  deposited: toDisplayAmount(
    position?.autocompoundBalanceOf,
    !!position,
    unitAbbr,
  ),
  rewards: toDisplayAmount(
    position && getRewardsValue(position.pendingRestakedRewardOf),
    !!position,
    unitAbbr,
  ),
  pending: toDisplayAmount(
    position?.pendingDepositedBalanceOf,
    !!position,
    unitAbbr,
  ),
  queue: toDisplayAmount(
    withdrawRequest &&
      getQueueValue(withdrawRequest.requested, withdrawRequest.readyForClaim),
    !!withdrawRequest,
    unitAbbr,
  ),
  claimable: toDisplayAmount(
    withdrawRequest?.readyForClaim,
    !!withdrawRequest,
    unitAbbr,
  ),
});

const getSub = (isDiscreetMode: boolean, sub: string | undefined) =>
  isDiscreetMode ? undefined : sub;

const EthPositionMetrics: React.FC<{
  amounts: ReturnType<typeof getEthAmounts>;
  isDiscreetMode: boolean;
  hasClaimable: boolean;
  toUsd: (displayAmount: string) => string;
}> = ({ amounts, isDiscreetMode, hasClaimable, toUsd }) => {
  const mask = (val: string) => (isDiscreetMode ? '****' : val);
  const { deposited, rewards, pending, queue, claimable } = amounts;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        gap: 10,
      }}
    >
      <MetricCard
        label="Actively staked"
        value={mask(deposited)}
        sub={getSub(isDiscreetMode, toUsd(deposited) || undefined)}
        green
        icon={<ArrowSentIcon width={13} height={12} fill="#4CAF7D" />}
      />
      <MetricCard
        label="Rewards"
        value={mask(rewards)}
        sub={getSub(isDiscreetMode, toUsd(rewards) || undefined)}
        green
        icon={<GraphIcon width={14} height={8} />}
      />
      <MetricCard
        label="Pending deposit"
        value={mask(pending)}
        sub={getSub(isDiscreetMode, 'Entering pool')}
        icon={<ClockIcon width={13} height={13} />}
      />
      <MetricCard
        label="Unstaking queue"
        value={mask(queue)}
        sub={getSub(isDiscreetMode, 'Processing')}
        icon={<HourglassIcon width={11} height={13} />}
      />
      <MetricCard
        label="Ready to claim"
        value={mask(claimable)}
        sub={getSub(isDiscreetMode || !hasClaimable, 'Available now')}
        icon={<WalletIconRounded width={14} height={12} />}
      />
    </div>
  );
};

const EthPositionSection: React.FC<{
  loading: boolean;
  amounts: ReturnType<typeof getEthAmounts>;
  isDiscreetMode: boolean;
  hasClaimable: boolean;
  toUsd: (displayAmount: string) => string;
}> = ({ loading, ...metricProps }) => (
  <div>
    <T variant="span" style={SECTION_LABEL_STYLE}>
      Your position
    </T>
    {loading ? (
      <F align="center" gap={10}>
        <Throbber size={18} strokeWidth={2} />
        <T
          variant="span"
          style={{ fontFamily: 'Poppins', fontSize: 14, color: '#8B8682' }}
        >
          Loading position...
        </T>
      </F>
    ) : (
      <EthPositionMetrics {...metricProps} />
    )}
  </div>
);

const getClaimLabel = (hasClaimable: boolean, unitAbbr: string) =>
  hasClaimable ? `Claim ${unitAbbr}` : 'Nothing to claim';

const EthActionsSection: React.FC<{
  unitAbbr: string;
  hasStaked: boolean;
  hasClaimable: boolean;
  openDialog: (mode: EverstakeMode) => void;
}> = ({ unitAbbr, hasStaked, hasClaimable, openDialog }) => (
  <div>
    <T variant="span" style={SECTION_LABEL_STYLE}>
      Actions
    </T>
    <F gap={12} $flexWrap="wrap">
      <ActionCard
        icon={<ArrowSentIcon width={18} height={16} fill="#C4922A" />}
        title="Stake"
        description="Stake through Everstake’s infrastructure to start receiving protocol rewards."
        buttonLabel={`Stake ${unitAbbr}`}
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
        description={`Withdraw ${unitAbbr} from your staked position. Instant if pool liquidity allows, otherwise queued.`}
        buttonLabel={`Unstake ${unitAbbr}`}
        disabled={!hasStaked}
        onClick={() => openDialog('unstake')}
      />
      <ActionCard
        icon={<WalletIconRounded width={18} height={16} />}
        title="Claim"
        description={`Move unstaked ${unitAbbr} that has cleared the queue back to your wallet.`}
        buttonLabel={getClaimLabel(hasClaimable, unitAbbr)}
        disabled={!hasClaimable}
        onClick={() => openDialog('claim')}
      />
    </F>
  </div>
);

const EthHowItWorks: React.FC = () => (
  <div>
    <T variant="span" style={SECTION_LABEL_STYLE}>
      How it works
    </T>
    <F direction="column" gap={16} style={{ marginBottom: 20 }}>
      <FlowDiagram title="Staking" nodes={STAKING_NODES} />
      <FlowDiagram title="Unstaking" nodes={UNSTAKING_NODES} />
    </F>
    <InfoStrip items={INFO_ITEMS} />
  </div>
);

export const EthAccountPageContent: React.FC<{
  unitAbbr: string;
  toUsd: (displayAmount: string) => string;
  loading: boolean;
  position: everstakeEthService.IEverstakeUserPosition | undefined;
  withdrawRequest: everstakeEthService.IEverstakeWithdrawRequest | undefined;
  openDialog: (mode: EverstakeMode) => void;
  isDiscreetMode: boolean;
}> = ({
  unitAbbr,
  toUsd,
  loading,
  position,
  withdrawRequest,
  openDialog,
  isDiscreetMode,
}) => {
  const amounts = getEthAmounts(position, withdrawRequest, unitAbbr);
  const hasStaked = isPositive(position?.autocompoundBalanceOf);
  const hasClaimable = isPositive(withdrawRequest?.readyForClaim);

  return (
    <>
      <EthPositionSection
        loading={loading}
        amounts={amounts}
        isDiscreetMode={isDiscreetMode}
        hasClaimable={hasClaimable}
        toUsd={toUsd}
      />

      <div style={DIVIDER_STYLE} />

      <EthActionsSection
        unitAbbr={unitAbbr}
        hasStaked={hasStaked}
        hasClaimable={hasClaimable}
        openDialog={openDialog}
      />

      <div style={DIVIDER_STYLE} />

      <EthHowItWorks />
    </>
  );
};
