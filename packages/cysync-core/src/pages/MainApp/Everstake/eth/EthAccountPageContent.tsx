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

export const EthAccountPageContent: React.FC<{
  unitAbbr: string;
  toUsd: (displayAmount: string) => string;
  loading: boolean;
  position: everstakeEthService.IEverstakeUserPosition | undefined;
  withdrawRequest: everstakeEthService.IEverstakeWithdrawRequest | undefined;
  openDialog: (mode: EverstakeMode) => void;
}> = ({ unitAbbr, toUsd, loading, position, withdrawRequest, openDialog }) => {
  const deposited = position
    ? parseAmount(position.autocompoundBalanceOf, unitAbbr)
    : '–';
  const rewards = position
    ? (() => {
        const val = new BigNumber(position.pendingRestakedRewardOf || '0');
        return parseAmount(
          val.isGreaterThan(0) ? val.toFixed(10) : '0',
          unitAbbr,
        );
      })()
    : '–';
  const pending = position
    ? parseAmount(position.pendingDepositedBalanceOf, unitAbbr)
    : '–';
  const queueVal = withdrawRequest
    ? new BigNumber(withdrawRequest.requested)
        .minus(new BigNumber(withdrawRequest.readyForClaim))
        .toFixed(6)
    : '0';
  const queue = withdrawRequest ? parseAmount(queueVal, unitAbbr) : '–';
  const claimable = withdrawRequest
    ? parseAmount(withdrawRequest.readyForClaim, unitAbbr)
    : '–';

  const hasStaked = position
    ? new BigNumber(position.autocompoundBalanceOf).isGreaterThan(0)
    : false;
  const hasClaimable = withdrawRequest
    ? new BigNumber(withdrawRequest.readyForClaim).isGreaterThan(0)
    : false;

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
        <T variant="span" style={SECTION_LABEL_STYLE}>
          Actions
        </T>
        <F gap={12} $flexWrap="wrap">
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
            description={`Withdraw ${unitAbbr} from your staked position. Enters a processing period before becoming claimable.`}
            buttonLabel={`Unstake ${unitAbbr}`}
            disabled={!hasStaked}
            onClick={() => openDialog('unstake')}
          />
          <ActionCard
            icon={<WalletIconRounded width={18} height={16} />}
            title="Claim"
            description={`Move unstaked ${unitAbbr} that has cleared the queue back to your wallet.`}
            buttonLabel={
              hasClaimable ? `Claim ${claimable}` : 'Nothing to claim'
            }
            disabled={!hasClaimable}
            onClick={() => openDialog('claim')}
          />
        </F>
      </div>

      <div style={DIVIDER_STYLE} />

      {/* ── How it works ── */}
      <div>
        <T variant="span" style={SECTION_LABEL_STYLE}>
          How it works
        </T>
        <F direction="column" gap={16} style={{ marginBottom: 20 }}>
          <FlowDiagram title="Staking" nodes={stakingNodes} />
          <FlowDiagram title="Unstaking" nodes={unstakingNodes} />
        </F>
        <InfoStrip items={infoItems} />
      </div>
    </>
  );
};
