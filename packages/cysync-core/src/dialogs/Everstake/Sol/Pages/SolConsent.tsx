import { Button, CheckBox, Flex, Typography } from '@cypherock/cysync-ui';
import AccountIcon from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/AccountIcon';
import EverstakeLogo from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/EverstakeLogo';
import GoldExternalLink from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/GoldExternalLink';
import React, { useState } from 'react';

import { useSolEverstake } from '~/context/everstake/sol';

import {
  CENTERED_CARD_STYLE,
  INFO_BOX_STYLE,
  SOL_LEARN_MORE_URL,
} from './shared';

export const SolConsent: React.FC = () => {
  const { onProceed, unitAbbr } = useSolEverstake();
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div style={{ ...CENTERED_CARD_STYLE, gap: 24 }}>
      {/* Title */}
      <Flex direction="column" gap={16} align="center" width="full">
        <Typography
          variant="span"
          $fontSize={22}
          $textAlign="center"
          $fontWeight="semibold"
          $lineHeight="1.2"
          pl="24px"
          pr="24px"
        >
          Your staked {unitAbbr} is
          <br />
          maintained by Everstake
        </Typography>
        <Flex direction="row" gap={6} align="center">
          <Typography variant="span" color="muted" $fontSize={16}>
            Powered by
          </Typography>
          <EverstakeLogo height={17} />
        </Flex>
      </Flex>

      {/* Info boxes */}
      <Flex direction="column" gap={8} width="full">
        <div style={INFO_BOX_STYLE}>
          <AccountIcon
            width={24}
            height={26}
            fill="white"
            style={{ flexShrink: 0 }}
          />
          <Typography
            variant="span"
            color="muted"
            $fontSize={16}
            $textAlign="center"
            $fontWeight="light"
            $lineHeight="1.5"
          >
            Stake your assets through the Everstake infrastructure to receive
            rewards and enhance the network&apos;s security and stability.
          </Typography>
        </div>
        <div style={INFO_BOX_STYLE}>
          <AccountIcon
            width={24}
            height={26}
            fill="white"
            style={{ flexShrink: 0 }}
          />
          <Typography
            variant="span"
            color="muted"
            $fontSize={16}
            $textAlign="center"
            $fontWeight="light"
            $lineHeight="1.5"
          >
            Enjoy protocol rewards, rely on a trusted validator, and retain full
            ownership of your assets.
          </Typography>
        </div>
      </Flex>

      {/* Learn more */}
      <a
        href={SOL_LEARN_MORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Flex direction="row" gap={6} align="center">
          <GoldExternalLink width={16} height={16} />
          <span
            style={{
              color: '#C4922A',
              textDecoration: 'underline',
              fontSize: 14,
            }}
          >
            Learn how it works
          </span>
        </Flex>
      </a>

      {/* Acknowledgment */}
      <Flex
        direction="row"
        gap={8}
        align="flex-start"
        justify="center"
        width="full"
        $cursor="pointer"
        onClick={() => setAcknowledged(v => !v)}
      >
        <div style={{ paddingTop: 2, flexShrink: 0 }}>
          <CheckBox
            checked={acknowledged}
            onChange={() => setAcknowledged(v => !v)}
            id="everstake-sol-consent"
          />
        </div>
        <Typography
          variant="span"
          color="muted"
          $fontSize={16}
          $letterSpacing="0.05em"
          $lineHeight="1.4"
        >
          I acknowledge and consent to
          <br />
          staking {unitAbbr} with Everstake
        </Typography>
      </Flex>

      {/* Confirm */}
      <Button
        variant="primary"
        disabled={!acknowledged}
        onClick={() => onProceed()}
      >
        Confirm
      </Button>
    </div>
  );
};
