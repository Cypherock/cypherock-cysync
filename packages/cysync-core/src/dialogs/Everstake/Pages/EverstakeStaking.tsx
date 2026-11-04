import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Check,
  LeanBox,
  LeanBoxContainer,
  Throbber,
  Typography,
  VerifyAmountDeviceGraphics,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useEverstake } from '~/context/everstake';

const checkIcon = <Check width={15} height={12} />;
const throbberIcon = <Throbber size={15} strokeWidth={2} />;
const arrowIcon = <ArrowRightIcon />;

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

const getIcon = (
  deviceEvents: Record<number, boolean | undefined>,
  loadingEvent: SignTransactionDeviceEvent,
  completedEvent: SignTransactionDeviceEvent,
) => {
  if (deviceEvents[completedEvent]) return checkIcon;
  if (deviceEvents[loadingEvent]) return throbberIcon;
  return undefined;
};

export const EverstakeStaking: React.FC = () => {
  const { deviceEvents, selectedWallet } = useEverstake();

  const items = [
    {
      id: '1',
      text: 'Verify coin on X1 Vault',
      rightImage: getIcon(
        deviceEvents,
        SignTransactionDeviceEvent.INIT,
        SignTransactionDeviceEvent.CONFIRMED,
      ),
    },
    {
      id: '2',
      text: 'Verify transaction details',
      rightImage: getIcon(
        deviceEvents,
        SignTransactionDeviceEvent.CONFIRMED,
        SignTransactionDeviceEvent.VERIFIED,
      ),
    },
    ...(selectedWallet?.hasPassphrase
      ? [
          {
            id: '3',
            text: 'Enter passphrase',
            rightImage: getIcon(
              deviceEvents,
              SignTransactionDeviceEvent.VERIFIED,
              SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
            ),
          },
        ]
      : []),
    {
      id: '4',
      text: selectedWallet?.hasPin ? 'Enter PIN' : 'Tap X1 Card',
      rightImage: getIcon(
        deviceEvents,
        selectedWallet?.hasPassphrase
          ? SignTransactionDeviceEvent.PASSPHRASE_ENTERED
          : SignTransactionDeviceEvent.VERIFIED,
        SignTransactionDeviceEvent.CARD_TAPPED,
      ),
    },
  ];

  return (
    <div style={CARD_STYLE}>
      <VerifyAmountDeviceGraphics />
      <Typography variant="h5" $textAlign="center">
        Confirm on X1 Vault
      </Typography>
      <LeanBoxContainer>
        {items.map(item => (
          <LeanBox
            key={item.id}
            id={item.id}
            text={item.text}
            leftImage={arrowIcon}
            rightImage={item.rightImage}
          />
        ))}
      </LeanBoxContainer>
    </div>
  );
};
