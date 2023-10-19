import { SignMessageDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  CloseButton,
  Flex,
  Divider,
  LeanBoxProps,
  ArrowRightIcon,
  Check,
  Throbber,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { useWalletConnect } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

import { Title } from './components';

import { useSignMessageDialog } from '../context';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const ViewSigningStateDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { signMessage } = lang.strings;
  const { activeWallet } = useWalletConnect();
  const { onClose, deviceEvents, startFlow } = useSignMessageDialog();

  useEffect(() => {
    startFlow();
  }, []);

  const getDeviceEventIcon = (
    loadingEvent: SignMessageDeviceEvent,
    completedEvent: SignMessageDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIconComponent;
    if (deviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: signMessage.actions.confirmDevice,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          SignMessageDeviceEvent.INIT,
          SignMessageDeviceEvent.CONFIRMED,
        ),
      },
      {
        id: '4',
        leftImage: rightArrowIcon,
        text: signMessage.actions.verifyData,
        rightImage: getDeviceEventIcon(
          SignMessageDeviceEvent.CONFIRMED,
          SignMessageDeviceEvent.VERIFIED,
        ),
      },
    ];

    if (activeWallet?.hasPassphrase) {
      actions.push({
        id: '2',
        text: signMessage.actions.enterPassphrase,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          SignMessageDeviceEvent.VERIFIED,
          SignMessageDeviceEvent.PASSPHRASE_ENTERED,
        ),
      });
    }

    if (activeWallet?.hasPin) {
      actions.push({
        id: '3',
        text: signMessage.actions.enterPin,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          activeWallet.hasPassphrase
            ? SignMessageDeviceEvent.PASSPHRASE_ENTERED
            : SignMessageDeviceEvent.VERIFIED,
          SignMessageDeviceEvent.CARD_TAPPED,
        ),
      });
    } else {
      actions.push({
        id: '3',
        text: signMessage.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          activeWallet?.hasPassphrase
            ? SignMessageDeviceEvent.PASSPHRASE_ENTERED
            : SignMessageDeviceEvent.VERIFIED,
          SignMessageDeviceEvent.CARD_TAPPED,
        ),
      });
    }

    return actions;
  }, [deviceEvents]);

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody pt={0} pr={0} pb={0} pl={0} gap={0}>
        <Title />
        <Container
          width="full"
          align="stretch"
          display="flex"
          direction="column"
          pt={2}
          pb={4}
          px={5}
        >
          <LeanBoxContainer>
            {actionsList.map(data => (
              <LeanBox key={data.id} {...data} />
            ))}
          </LeanBoxContainer>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
