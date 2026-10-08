import {
  Button,
  Flex,
  HourglassIcon,
  InformationIcon,
  SyncingIcon,
  Typography,
  WalletIconRounded,
} from '@cypherock/cysync-ui';
import React from 'react';

import { EverstakeMode, useEverstake } from '~/context/everstake';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  alignItems: 'center',
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
};

const INFO_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'flex-start',
  width: '100%',
  borderRadius: 8,
  border: '1px solid #3C3C3C',
  background: '#27221D',
  padding: '14px 16px',
};

export const EverstakeActionInfo: React.FC = () => {
  const { mode, onProceed, unitAbbr } = useEverstake();

  const copy: Record<
    EverstakeMode,
    { icon: React.ReactNode; title: string; items: string[] }
  > = {
    stake: { icon: null, title: '', items: [] },
    claim: { icon: null, title: '', items: [] },
    unstake: {
      icon: <HourglassIcon width={26} height={26} />,
      title: 'Before you unstake',
      items: [
        `Unstaking starts an ~80 checkpoint unbonding period (roughly 3-4 days). Your ${unitAbbr} won't earn rewards during this time.`,
        'You can only have one unstake request in progress. Claim any existing one before starting another.',
        "Once it's ready, you'll need to come back and claim it manually — it won't arrive in your wallet automatically.",
      ],
    },
    claimRewards: {
      icon: <WalletIconRounded width={24} height={22} />,
      title: 'Claim rewards',
      items: [
        `This moves your accumulated ${unitAbbr} rewards directly to your wallet.`,
        'Your staked (delegated) balance is not affected — only the rewards earned so far are claimed.',
      ],
    },
    restake: {
      icon: <SyncingIcon width={24} height={24} />,
      title: 'Restake rewards',
      items: [
        'This compounds your accumulated rewards back into your staked position instead of sending them to your wallet.',
        'Your staked balance will increase by the reward amount, and your claimable rewards will reset to 0.',
      ],
    },
    claimUnstake: {
      icon: <InformationIcon width={24} height={24} />,
      title: `Claim unstaked ${unitAbbr}`,
      items: [
        'This is only available once your unbonding period has fully completed.',
        `Moves the unbonded ${unitAbbr} back to your wallet in one transaction.`,
      ],
    },
  };

  const current = copy[mode];

  return (
    <div style={CARD_STYLE}>
      <Flex direction="column" gap={12} align="center" width="full">
        {current.icon}
        <Typography
          variant="span"
          $fontSize={22}
          $textAlign="center"
          $fontWeight="semibold"
        >
          {current.title}
        </Typography>
      </Flex>

      <Flex direction="column" gap={8} width="full">
        {current.items.map(item => (
          <div key={item} style={INFO_ROW_STYLE}>
            <Typography
              variant="span"
              color="muted"
              $fontSize={14}
              $lineHeight="1.6"
            >
              {item}
            </Typography>
          </div>
        ))}
      </Flex>

      <Button variant="primary" onClick={() => onProceed()}>
        Continue
      </Button>
    </div>
  );
};
