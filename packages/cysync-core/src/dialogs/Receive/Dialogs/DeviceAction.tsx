import { ReceiveDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Container,
  GenericConfirmDeviceGraphics,
  LeanBoxContainer,
  LeanBox,
  Throbber,
  LeanBoxProps,
  ArrowRightIcon,
  Check,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../context';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DeviceAction: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const texts = lang.strings.receive.x1Vault;

  const { onNext, deviceEvents, selectedWallet, startFlow, derivedAddress } =
    useReceiveDialog();

  useEffect(() => {
    if (deviceEvents[ReceiveDeviceEvent.CARD_TAPPED]) {
      onNext();
    }
  }, [deviceEvents]);

  useEffect(() => {
    startFlow();
  }, []);

  const getDeviceEventIcon = (
    loadingEvent: ReceiveDeviceEvent,
    completedEvent: ReceiveDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIconComponent;
    if (deviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: lang.strings.receive.x1Vault.actions.verifyCoin,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          ReceiveDeviceEvent.INIT,
          ReceiveDeviceEvent.CONFIRMED,
        ),
      },
    ];

    if (selectedWallet?.hasPassphrase) {
      actions.push({
        id: '2',
        text: lang.strings.receive.x1Vault.actions.enterPassphrase,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          ReceiveDeviceEvent.CONFIRMED,
          ReceiveDeviceEvent.PASSPHRASE_ENTERED,
        ),
      });
    }

    if (selectedWallet?.hasPin) {
      actions.push({
        id: '3',
        text: lang.strings.receive.x1Vault.actions.enterPin,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          selectedWallet.hasPassphrase
            ? ReceiveDeviceEvent.PASSPHRASE_ENTERED
            : ReceiveDeviceEvent.CONFIRMED,
          ReceiveDeviceEvent.CARD_TAPPED,
        ),
      });
    } else {
      actions.push({
        id: '3',
        text: lang.strings.receive.x1Vault.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          selectedWallet?.hasPassphrase
            ? ReceiveDeviceEvent.PASSPHRASE_ENTERED
            : ReceiveDeviceEvent.CONFIRMED,
          ReceiveDeviceEvent.CARD_TAPPED,
        ),
      });
    }

    return actions;
  }, [deviceEvents]);

  if (derivedAddress === undefined) return <LoaderDialog />;

  return (
    <DialogBox width={600}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <GenericConfirmDeviceGraphics />
        <Container display="flex" direction="column" width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={texts.title} />
          </Typography>
          <Typography
            variant="span"
            $textAlign="center"
            $fontSize={14}
            $fontWeight="normal"
            color="muted"
          >
            <LangDisplay text={texts.subtitle} />
          </Typography>
        </Container>
        <LeanBoxContainer>
          {actionsList.map(data => (
            <LeanBox
              key={data.id}
              leftImage={data.leftImage}
              rightImage={data.rightImage}
              text={data.text}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
