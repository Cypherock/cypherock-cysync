import EverstakeLogo from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/EverstakeLogo';
import AccountIcon from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/AccountIcon';
import GoldExternalLink from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/GoldExternalLink';
import { Button, CheckBox, Flex, Typography } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { useEverstake } from '~/context/everstake';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'center',
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
};

const INFO_BOX_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  borderRadius: 8,
  border: '1px solid #3C3C3C',
  background: '#27221D',
  padding: 16,
};

export const EverstakeConsent: React.FC = () => {
  const { onProceed } = useEverstake();
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div style={CARD_STYLE}>
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
          Your staked ETH is
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
          <AccountIcon width={48} height={51} fill="white" />
          <Typography
            variant="span"
            color="muted"
            $fontSize={16}
            $textAlign="center"
            $fontWeight="light"
            $lineHeight="1.5"
          >
            Everstake maintains and protects your staked ETH with their smart
            contracts, infrastructure, and technology.
          </Typography>
        </div>
        <div style={INFO_BOX_STYLE}>
          <AccountIcon width={48} height={51} fill="white" />
          <Typography
            variant="span"
            color="muted"
            $fontSize={16}
            $textAlign="center"
            $fontWeight="light"
            $lineHeight="1.5"
          >
            When staking, the responsibility for your ETH security transitions
            from your Cypherock X1 Vault to Everstake.
          </Typography>
        </div>
      </Flex>

      {/* Learn more */}
      <a
        href="https://everstake.one/ethereum"
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
            id="everstake-consent"
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
          staking ETH with Everstake
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
