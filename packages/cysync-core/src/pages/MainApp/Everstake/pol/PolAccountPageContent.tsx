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

export const PolAccountPageContent: React.FC<{
  unitAbbr: string;
  loading: boolean;
  polPosition: everstakePolService.IEverstakePolPosition | undefined;
  openDialog: (mode: EverstakeMode) => void;
}> = ({ unitAbbr, loading, polPosition, openDialog }) => {
  const staked = polPosition
    ? parseAmount(polPosition.stakedBalance, unitAbbr)
    : '–';
  const rewards = polPosition
    ? parseAmount(polPosition.claimableRewards, unitAbbr)
    : '–';
  const unbonding = polPosition?.unbonding ?? null;
  const unbondingAmount = unbonding
    ? parseAmount(unbonding.amount, unitAbbr)
    : parseAmount('0', unitAbbr);
  const readyToClaim =
    unbonding && unbonding.isClaimable
      ? parseAmount(unbonding.amount, unitAbbr)
      : parseAmount('0', unitAbbr);

  const hasStaked = polPosition
    ? new BigNumber(polPosition.stakedBalance).isGreaterThan(0)
    : false;
  const hasRewards = polPosition
    ? new BigNumber(polPosition.claimableRewards).isGreaterThan(0)
    : false;
  const hasActiveUnbond = !!unbonding;
  const hasClaimableUnbond = !!unbonding?.isClaimable;

  const unbondingSub = (() => {
    if (!unbonding) return 'None pending';
    if (unbonding.isClaimable) return 'Claimable now';
    return `${unbonding.checkpointsRemaining} checkpoints left`;
  })();

  const stakingNodes: FlowNode[] = [
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

  const unstakingNodes: FlowNode[] = [
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

  const stakingCaption =
    'No pending period — delegation is instant. First-time stakers may sign an extra approval transaction before this.';
  const unstakingCaption =
    'Rewards are separate — claim to wallet or restake anytime, independent of unbonding.';

  const infoItems = [
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

  return (
    <>
      {/* ── Position ── */}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 10,
            }}
          >
            <MetricCard
              label="Actively staked"
              value={staked}
              sub="Delegated and earning rewards"
              green
              icon={<ArrowSentIcon width={13} height={12} fill="#4CAF7D" />}
            />
            <MetricCard
              label="Rewards"
              value={rewards}
              sub="Since your last claim or restake"
              green
              icon={<GraphIcon width={14} height={8} />}
            />
            <MetricCard
              label="Unbonding"
              value={unbondingAmount}
              sub={unbondingSub}
              icon={<HourglassIcon width={11} height={13} />}
            />
            <MetricCard
              label="Ready to claim"
              value={readyToClaim}
              sub={
                hasClaimableUnbond
                  ? 'Unbonded, available now'
                  : 'Nothing to claim yet'
              }
              icon={<WalletIconRounded width={14} height={12} />}
            />
          </div>
        )}
      </div>

      <div style={DIVIDER_STYLE} />

      {/* ── Actions ── */}
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
            description={`Send ${unitAbbr} into the Everstake pool to start earning staking rewards.`}
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
            description={
              hasActiveUnbond
                ? `You already have an unbonding ${unitAbbr} request in progress. Claim it before starting a new unstake.`
                : `Withdraw ${unitAbbr} from your staked position. Starts an unbonding period before becoming claimable.`
            }
            buttonLabel={`Unstake ${unitAbbr}`}
            disabled={!hasStaked || hasActiveUnbond}
            onClick={() => openDialog('unstake')}
          />
          <ActionCard
            icon={<WalletIconRounded width={18} height={16} />}
            title="Claim unstaked"
            description={`Move ${unitAbbr} that has cleared unbonding back to your wallet.`}
            buttonLabel={
              hasClaimableUnbond ? `Claim ${readyToClaim}` : 'Nothing to claim'
            }
            disabled={!hasClaimableUnbond}
            onClick={() => openDialog('claimUnstake')}
          />
        </div>
      </div>

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
            buttonLabel={hasRewards ? `Claim ${rewards}` : 'Nothing to claim'}
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

      <div style={DIVIDER_STYLE} />

      {/* ── How it works ── */}
      <div>
        <T variant="span" style={SECTION_LABEL_STYLE}>
          How it works
        </T>
        <F direction="column" gap={16} style={{ marginBottom: 20 }}>
          <FlowDiagram
            title="Staking"
            nodes={stakingNodes}
            caption={stakingCaption}
          />
          <FlowDiagram
            title="Unstaking"
            nodes={unstakingNodes}
            caption={unstakingCaption}
          />
        </F>
        <InfoStrip items={infoItems} />
      </div>
    </>
  );
};
