import {
  Button,
  Flex,
  HourglassIcon,
  Typography,
  WalletIconRounded,
} from '@cypherock/cysync-ui';
import React from 'react';

import { SolEverstakeMode, useSolEverstake } from '~/context/everstake/sol';

import { CENTERED_CARD_STYLE, INFO_ROW_STYLE } from './shared';

export const SolActionInfo: React.FC = () => {
  const { mode, onProceed, unitAbbr } = useSolEverstake();

  const copy: Record<
    SolEverstakeMode,
    { icon: React.ReactNode; title: string; items: string[] }
  > = {
    stake: { icon: null, title: '', items: [] },
    unstake: {
      icon: <HourglassIcon width={26} height={26} />,
      title: 'Before you unstake',
      items: [
        `Unstaking deactivates your stake. It can take up to the end of the current epoch (about 2-3 days) before your ${unitAbbr} is ready to claim, and it won't earn rewards meanwhile.`,
        'Depending on the amount, one or more of your stake accounts may be deactivated in full, or one may be split. You may end up unstaking slightly more than you enter.',
        "Once it's ready, you'll need to come back and claim it manually. It won't arrive in your wallet automatically.",
      ],
    },
    claim: {
      icon: <WalletIconRounded width={24} height={22} />,
      title: `Claim unstaked ${unitAbbr}`,
      items: [
        'This is only available for stake that has finished deactivating.',
        `Moves all of your deactivated ${unitAbbr} back to your wallet in one transaction.`,
      ],
    },
  };

  const current = copy[mode];

  return (
    <div style={{ ...CENTERED_CARD_STYLE, gap: 20 }}>
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
