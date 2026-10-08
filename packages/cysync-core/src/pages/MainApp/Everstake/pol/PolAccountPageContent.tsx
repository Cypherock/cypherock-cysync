import {
  ArrowReceivedIcon,
  ArrowSentIcon,
  GraphIcon,
  HourglassIcon,
  InformationIcon,
  SyncingIcon,
  Throbber,
  WalletIconRounded,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React from 'react';

import { EverstakeMode } from '~/context/everstake';
import * as everstakePolService from '~/services/everstakePolService';

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
    label: 'Stake / delegate',
    icon: <ArrowSentIcon width={14} height={12} fill="#C4922A" />,
  },
  {
    label: 'Actively staked (instant)',
    icon: <ArrowSentIcon width={14} height={12} fill="#4CAF7D" />,
  },
  {
    label: 'Rewards accrue',
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
    label: 'Unstake / undelegate',
    icon: <ArrowReceivedIcon width={14} height={12} fill="#C4922A" />,
  },
  {
    label: 'Unbonding (~80 checkpoints)',
    icon: <HourglassIcon width={11} height={13} />,
    dashed: true,
  },
  {
    label: 'Claim unstake (manual)',
    icon: <ArrowReceivedIcon width={14} height={12} fill="#4CAF7D" />,
  },
  {
    label: 'Your wallet',
    icon: <WalletIconRounded width={14} height={12} />,
  },
];

const STAKING_CAPTION =
  'No pending period — delegation is instant. First-time stakers may sign an extra approval transaction before this.';
const UNSTAKING_CAPTION =
  'Rewards are separate — claim to wallet or restake anytime, independent of unbonding.';

const getInfoItems = (unitAbbr: string) => [
  {
    icon: <HourglassIcon width={15} height={17} />,
    title: 'One unbond at a time',
    body: `Only one unstake request can be active. Claim it before starting another — a second unstake is blocked until then.`,
  },
  {
    icon: <InformationIcon width={17} height={17} />,
    title: 'Non-custodial',
    body: 'Everstake uses non-custodial smart contracts. You retain full control of your assets at all times.',
  },
  {
    icon: <GraphIcon width={20} height={10} />,
    title: 'Rewards need action',
    body: `Unlike ETH, ${unitAbbr} rewards don't auto-compound — claim them to your wallet or restake them manually.`,
  },
];

type PolUnbonding = everstakePolService.IEverstakePolPosition['unbonding'];

const isPositive = (value: string | undefined) =>
  value !== undefined && new BigNumber(value).isGreaterThan(0);

const getUnbondingSub = (unbonding: PolUnbonding | null) => {
  if (!unbonding) return 'None pending';
  if (unbonding.isClaimable) return 'Claimable now';
  return `${unbonding.checkpointsRemaining} checkpoints left`;
};

const getPolAmounts = (
  polPosition: everstakePolService.IEverstakePolPosition | undefined,
  unitAbbr: string,
) => {
  const unbonding = polPosition?.unbonding ?? null;
  const unbondingValue = unbonding?.amount ?? '0';
  return {
    staked: polPosition
      ? parseAmount(polPosition.stakedBalance, unitAbbr)
      : '–',
    rewards: polPosition
      ? parseAmount(polPosition.claimableRewards, unitAbbr)
      : '–',
    unbondingAmount: parseAmount(unbondingValue, unitAbbr),
    readyToClaim: parseAmount(
      unbonding?.isClaimable ? unbondingValue : '0',
      unitAbbr,
    ),
  };
};

const getSub = (isDiscreetMode: boolean, sub: string | undefined) =>
  isDiscreetMode ? undefined : sub;

const getClaimLabel = (canClaim: boolean, unitAbbr: string) =>
  canClaim ? `Claim ${unitAbbr}` : 'Nothing to claim';

const getUnstakeDescription = (hasActiveUnbond: boolean, unitAbbr: string) =>
  hasActiveUnbond
    ? `You already have an unbonding ${unitAbbr} request in progress. Claim it before starting a new unstake.`
    : `Withdraw ${unitAbbr} from your staked position. Starts an unbonding period before becoming claimable.`;

const PolPositionMetrics: React.FC<{
  amounts: ReturnType<typeof getPolAmounts>;
  isDiscreetMode: boolean;
  unbondingSub: string;
  claimSub: string | undefined;
}> = ({ amounts, isDiscreetMode, unbondingSub, claimSub }) => {
  const mask = (val: string) => (isDiscreetMode ? '****' : val);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 10,
      }}
    >
      <MetricCard
        label="Actively staked"
        value={mask(amounts.staked)}
        sub={getSub(isDiscreetMode, 'Delegated and earning rewards')}
        green
        icon={<ArrowSentIcon width={13} height={12} fill="#4CAF7D" />}
      />
      <MetricCard
        label="Rewards"
        value={mask(amounts.rewards)}
        sub={getSub(isDiscreetMode, 'Since your last claim or restake')}
        green
        icon={<GraphIcon width={14} height={8} />}
      />
      <MetricCard
        label="Unbonding"
        value={mask(amounts.unbondingAmount)}
        sub={getSub(isDiscreetMode, unbondingSub)}
        icon={<HourglassIcon width={11} height={13} />}
      />
      <MetricCard
        label="Ready to claim"
        value={mask(amounts.readyToClaim)}
        sub={claimSub}
        icon={<WalletIconRounded width={14} height={12} />}
      />
    </div>
  );
};

const PolPositionSection: React.FC<{
  loading: boolean;
  amounts: ReturnType<typeof getPolAmounts>;
  isDiscreetMode: boolean;
  unbondingSub: string;
  claimSub: string | undefined;
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
      <PolPositionMetrics {...metricProps} />
    )}
  </div>
);

const PolManageStake: React.FC<{
  unitAbbr: string;
  hasStaked: boolean;
  hasActiveUnbond: boolean;
  hasClaimableUnbond: boolean;
  openDialog: (mode: EverstakeMode) => void;
}> = ({
  unitAbbr,
  hasStaked,
  hasActiveUnbond,
  hasClaimableUnbond,
  openDialog,
}) => (
  <div>
    <T variant="span" style={SECTION_LABEL_STYLE}>
      Manage stake
    </T>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 12,
      }}
    >
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
        description={getUnstakeDescription(hasActiveUnbond, unitAbbr)}
        buttonLabel={`Unstake ${unitAbbr}`}
        disabled={!hasStaked || hasActiveUnbond}
        onClick={() => openDialog('unstake')}
      />
      <ActionCard
        icon={<WalletIconRounded width={18} height={16} />}
        title="Claim unstaked"
        description={`Move ${unitAbbr} that has cleared unbonding back to your wallet.`}
        buttonLabel={getClaimLabel(hasClaimableUnbond, unitAbbr)}
        disabled={!hasClaimableUnbond}
        onClick={() => openDialog('claimUnstake')}
      />
    </div>
  </div>
);

const PolManageRewards: React.FC<{
  unitAbbr: string;
  hasRewards: boolean;
  openDialog: (mode: EverstakeMode) => void;
}> = ({ unitAbbr, hasRewards, openDialog }) => (
  <div>
    <T variant="span" style={SECTION_LABEL_STYLE}>
      Manage rewards
    </T>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 12,
      }}
    >
      <ActionCard
        icon={<WalletIconRounded width={18} height={16} />}
        title="Claim rewards"
        description={`Move accumulated ${unitAbbr} rewards to your wallet.`}
        buttonLabel={getClaimLabel(hasRewards, unitAbbr)}
        disabled={!hasRewards}
        onClick={() => openDialog('claimRewards')}
      />
      <ActionCard
        icon={<SyncingIcon width={18} height={16} />}
        title="Restake"
        description={`Compound accumulated ${unitAbbr} rewards back into your staked position.`}
        buttonLabel="Restake rewards"
        disabled={!hasRewards}
        onClick={() => openDialog('restake')}
      />
    </div>
  </div>
);

const PolHowItWorks: React.FC<{ unitAbbr: string }> = ({ unitAbbr }) => (
  <div>
    <T variant="span" style={SECTION_LABEL_STYLE}>
      How it works
    </T>
    <F direction="column" gap={16} style={{ marginBottom: 20 }}>
      <FlowDiagram
        title="Staking"
        nodes={STAKING_NODES}
        caption={STAKING_CAPTION}
      />
      <FlowDiagram
        title="Unstaking"
        nodes={UNSTAKING_NODES}
        caption={UNSTAKING_CAPTION}
      />
    </F>
    <InfoStrip items={getInfoItems(unitAbbr)} />
  </div>
);

export const PolAccountPageContent: React.FC<{
  unitAbbr: string;
  loading: boolean;
  polPosition: everstakePolService.IEverstakePolPosition | undefined;
  openDialog: (mode: EverstakeMode) => void;
  isDiscreetMode: boolean;
}> = ({ unitAbbr, loading, polPosition, openDialog, isDiscreetMode }) => {
  const amounts = getPolAmounts(polPosition, unitAbbr);
  const unbonding = polPosition?.unbonding ?? null;
  const hasStaked = isPositive(polPosition?.stakedBalance);
  const hasRewards = isPositive(polPosition?.claimableRewards);
  const hasActiveUnbond = !!unbonding;
  const hasClaimableUnbond = !!unbonding?.isClaimable;
  const claimSub = getSub(
    isDiscreetMode,
    hasClaimableUnbond ? 'Unbonded, available now' : 'Nothing to claim yet',
  );

  return (
    <>
      <PolPositionSection
        loading={loading}
        amounts={amounts}
        isDiscreetMode={isDiscreetMode}
        unbondingSub={getUnbondingSub(unbonding)}
        claimSub={claimSub}
      />

      <div style={DIVIDER_STYLE} />

      <PolManageStake
        unitAbbr={unitAbbr}
        hasStaked={hasStaked}
        hasActiveUnbond={hasActiveUnbond}
        hasClaimableUnbond={hasClaimableUnbond}
        openDialog={openDialog}
      />

      <PolManageRewards
        unitAbbr={unitAbbr}
        hasRewards={hasRewards}
        openDialog={openDialog}
      />

      <div style={DIVIDER_STYLE} />

      <PolHowItWorks unitAbbr={unitAbbr} />
    </>
  );
};
