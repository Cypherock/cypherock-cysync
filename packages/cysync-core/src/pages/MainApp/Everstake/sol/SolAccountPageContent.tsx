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

import { lamportsToSol } from '~/context/everstake/sol/utils';
import * as everstakeSolService from '~/services/everstakeSolService';

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

export type SolDialogMode = 'stake' | 'unstake' | 'claim';

const stakeAccountsLabel = (count: number) =>
  `${count} stake account${count === 1 ? '' : 's'}`;

export const SolAccountPageContent: React.FC<{
  unitAbbr: string;
  loading: boolean;
  position: everstakeSolService.IEverstakeSolPosition | undefined;
  openDialog: (mode: SolDialogMode) => void;
  isDiscreetMode: boolean;
}> = ({ unitAbbr, loading, position, openDialog, isDiscreetMode }) => {
  const mask = (val: string) => (isDiscreetMode ? '****' : val);
  const fmt = (lamports: string | undefined) =>
    position ? parseAmount(lamportsToSol(lamports).toFixed(), unitAbbr) : '–';

  const hasActive = position
    ? new BigNumber(position.active.stakeLamports).isGreaterThan(0)
    : false;
  // Refundable deposit (rent reserve) included in what a claim returns
  const claimDeposit = position
    ? new BigNumber(position.deactivated.lamports).minus(
        position.deactivated.stakeLamports,
      )
    : new BigNumber(0);

  const hasClaimable = position
    ? new BigNumber(position.deactivated.lamports).isGreaterThan(0)
    : false;
  let claimSub: string | undefined;
  if (!isDiscreetMode && hasClaimable) {
    claimSub = claimDeposit.isGreaterThan(0)
      ? `Incl. ${lamportsToSol(
          claimDeposit.toFixed(),
        ).toFixed()} refundable deposit`
      : 'Available now';
  }

  const hasInactive = position
    ? new BigNumber(position.inactive.lamports).isGreaterThan(0)
    : false;

  const columns = hasInactive ? 5 : 4;

  const stakingNodes: FlowNode[] = [
    {
      label: 'Your wallet',
      icon: <WalletIconRounded width={14} height={12} />,
    },
    {
      label: 'Stake (new stake account)',
      icon: <ArrowSentIcon width={14} height={12} fill="#C4922A" />,
    },
    {
      label: 'Activating (until next epoch)',
      icon: <ClockIcon width={13} height={13} />,
      dashed: true,
    },
    {
      label: 'Actively staked',
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
      label: 'Unstake / deactivate',
      icon: <ArrowReceivedIcon width={14} height={12} fill="#C4922A" />,
    },
    {
      label: 'Deactivating (until epoch ends)',
      icon: <HourglassIcon width={11} height={13} />,
      dashed: true,
    },
    {
      label: 'Claim (manual)',
      icon: <ArrowReceivedIcon width={14} height={12} fill="#4CAF7D" />,
    },
    {
      label: 'Your wallet',
      icon: <WalletIconRounded width={14} height={12} />,
    },
  ];

  const stakingCaption =
    'Each stake creates its own stake account. It starts earning once it activates at the next epoch (about 2-3 days).';
  const unstakingCaption =
    'Unstaking may deactivate whole stake accounts or split one. Claim withdraws all deactivated stake at once.';

  const infoItems = [
    {
      icon: <HourglassIcon width={15} height={17} />,
      title: 'Cooldown period',
      body: `Unstaked ${unitAbbr} becomes claimable after the current epoch ends (about 2-3 days). It does not earn rewards meanwhile.`,
    },
    {
      icon: <InformationIcon width={17} height={17} />,
      title: 'Stake accounts',
      body: 'Every stake lives in its own on-chain stake account. Stake and withdraw authority stay with your wallet. Each account holds a small refundable deposit that is returned when you claim.',
    },
    {
      icon: <GraphIcon width={20} height={10} />,
      title: 'Rewards',
      body: 'Rewards accrue in your stake accounts each epoch, so they show up in your active stake. There is no separate reward claim.',
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
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 10,
            }}
          >
            <MetricCard
              label="Actively staked"
              value={mask(fmt(position?.active.stakeLamports))}
              sub={
                isDiscreetMode || !position
                  ? undefined
                  : stakeAccountsLabel(position.active.accountCount)
              }
              green
              icon={<ArrowSentIcon width={13} height={12} fill="#4CAF7D" />}
            />
            <MetricCard
              label="Activating"
              value={mask(fmt(position?.activating.stakeLamports))}
              sub={
                isDiscreetMode || !position
                  ? undefined
                  : stakeAccountsLabel(position.activating.accountCount)
              }
              icon={<ClockIcon width={13} height={13} />}
            />
            <MetricCard
              label="Deactivating"
              value={mask(fmt(position?.deactivating.stakeLamports))}
              sub={
                isDiscreetMode || !position
                  ? undefined
                  : stakeAccountsLabel(position.deactivating.accountCount)
              }
              icon={<HourglassIcon width={11} height={13} />}
            />
            <MetricCard
              label="Ready to claim"
              value={mask(fmt(position?.deactivated.lamports))}
              sub={claimSub}
              icon={<WalletIconRounded width={14} height={12} />}
            />
            {hasInactive ? (
              <MetricCard
                label="Inactive"
                value={mask(fmt(position?.inactive.stakeLamports))}
                sub={
                  isDiscreetMode || !position
                    ? undefined
                    : stakeAccountsLabel(position.inactive.accountCount)
                }
                icon={<InformationIcon width={13} height={13} />}
              />
            ) : null}
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
            description={`Send ${unitAbbr} to the Everstake validator to start earning staking rewards.`}
            buttonLabel={`Stake ${unitAbbr}`}
            primary
            onClick={() => openDialog('stake')}
          />
          <ActionCard
            icon={
              <ArrowReceivedIcon
                width={18}
                height={16}
                fill={!hasActive ? '#8B8682' : '#C4922A'}
              />
            }
            title="Unstake"
            description={`Withdraw ${unitAbbr} from your active stake. It becomes claimable after the current epoch ends.`}
            buttonLabel={`Unstake ${unitAbbr}`}
            disabled={!hasActive}
            onClick={() => openDialog('unstake')}
          />
          <ActionCard
            icon={<WalletIconRounded width={18} height={16} />}
            title="Claim"
            description={`Move all ${unitAbbr} that has finished deactivating back to your wallet.`}
            buttonLabel={
              hasClaimable ? `Claim ${unitAbbr}` : 'Nothing to claim'
            }
            disabled={!hasClaimable}
            onClick={() => openDialog('claim')}
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
