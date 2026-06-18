import EverstakeLogo from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/EverstakeLogo';
import AccountIcon from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/AccountIcon';
import GoldExternalLink from '@cypherock/cysync-ui/dist/esm/assets/icons/generated/GoldExternalLink';
import {
  Button,
  CheckBox,
  Flex,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { useHysp } from '~/context/hysp';

const CARD: React.CSSProperties = {
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'center',
};

const INFO_BOX: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid #3C3C3C',
  background: '#27221D',
  padding: 16,
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'center',
};


export const HyspConsent: React.FC = () => {
  const { onProceed } = useHysp();
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div style={CARD}>
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
        <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 22, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.2, paddingLeft: 24, paddingRight: 24 }}>
          Your staked funds are<br />maintained by Everstake
        </span>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 16, color: '#8B8682' }}>
            Powered by
          </span>
          <EverstakeLogo height={17} />
        </div>
      </div>

      {/* Info boxes */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={INFO_BOX}>
          <AccountIcon width={48} height={51} fill="white" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: 16, color: '#8B8682', lineHeight: 1.5, textAlign: 'center' }}>
            Everstake maintains and protects your staked asset with their smart
            contracts, infrastructure, and technology.
          </span>
        </div>
        <div style={INFO_BOX}>
          <AccountIcon width={48} height={51} fill="white" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: 16, color: '#8B8682', lineHeight: 1.5, textAlign: 'center' }}>
            When staking, the responsibility for your funds&apos; security
            transitions from your Cypherock X1 Vault to Everstake.
          </span>
        </div>
      </div>

      {/* Learn how it works */}
      <a
        href="https://everstake.one/resources/blog/everstake-apollo-crypto-and-midas-launch-mevusd-a-regulatory-compliant-tokenized-strategy"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', textDecoration: 'none' }}
      >
        <GoldExternalLink width={16} height={16} />
        <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 14, color: '#C4922A', textDecoration: 'underline' }}>
          Learn how it works
        </span>
      </a>

      {/* Acknowledgment */}
      <div
        style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-start', width: '100%', cursor: 'pointer', justifyContent: 'center' }}
        onClick={() => setAcknowledged(v => !v)}
      >
        <div style={{ paddingTop: 2, flexShrink: 0 }}>
          <CheckBox
            checked={acknowledged}
            onChange={() => setAcknowledged(v => !v)}
            id="hysp-consent"
          />
        </div>
        <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 16, color: '#8B8682', letterSpacing: '0.05em', lineHeight: 1.4 }}>
          I acknowledge and consent to<br />staking with Everstake
        </span>
      </div>

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
