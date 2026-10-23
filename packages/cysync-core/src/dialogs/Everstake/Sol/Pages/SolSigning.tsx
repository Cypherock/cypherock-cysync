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

import { useSolEverstake } from '~/context/everstake/sol';

import { CENTERED_CARD_STYLE } from './shared';

const checkIcon = <Check width={15} height={12} />;
const throbberIcon = <Throbber size={15} strokeWidth={2} />;
const arrowIcon = <ArrowRightIcon />;

const getIcon = (
  deviceEvents: Record<number, boolean | undefined>,
  loadingEvent: SignTransactionDeviceEvent,
  completedEvent: SignTransactionDeviceEvent,
) => {
  if (deviceEvents[completedEvent]) return checkIcon;
  if (deviceEvents[loadingEvent]) return throbberIcon;
  return undefined;
};

export const SolSigning: React.FC = () => {
  const { deviceEvents, selectedWallet } = useSolEverstake();

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
    <div style={CENTERED_CARD_STYLE}>
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
