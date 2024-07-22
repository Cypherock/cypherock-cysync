import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  Check,
  LeanBoxProps,
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  verifyCoinIcon,
  Typography,
  Image,
  Container,
  ArrowRightIcon,
  Throbber,
} from '@cypherock/cysync-ui';
import React, { useEffect, useMemo } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../context';

const checkIcon = <Check width={15} height={12} />;
const throbber = <Throbber size={15} strokeWidth={2} />;

export const AddAccountDeviceActionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const {
    startAddAccounts,
    deviceEvents,
    addAccountStatus,
    onNext,
    selectedWallet,
  } = useAddAccountDialog();

  useEffect(() => {
    startAddAccounts();
  }, []);

  useEffect(() => {
    if (addAccountStatus === 'sync') {
      onNext();
    }
  }, [addAccountStatus]);

  const getDeviceEventIcon = (
    loadingEvent: CreateAccountDeviceEvent,
    completedEvent: CreateAccountDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIcon;
    if (deviceEvents[loadingEvent]) return throbber;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const rightArrowIcon = <ArrowRightIcon />;

    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: lang.strings.addAccount.deviceActions.actions.verifyCoin,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          CreateAccountDeviceEvent.INIT,
          CreateAccountDeviceEvent.CONFIRMED,
        ),
      },
    ];

    if (selectedWallet?.hasPassphrase) {
      actions.push({
        id: '2',
        text: lang.strings.addAccount.deviceActions.actions.enterPassphrase,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          CreateAccountDeviceEvent.CONFIRMED,
          CreateAccountDeviceEvent.PASSPHRASE_ENTERED,
        ),
      });
    }

    if (selectedWallet?.hasPin) {
      actions.push({
        id: '3',
        text: lang.strings.addAccount.deviceActions.actions.enterPin,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          selectedWallet.hasPassphrase
            ? CreateAccountDeviceEvent.PASSPHRASE_ENTERED
            : CreateAccountDeviceEvent.CONFIRMED,
          CreateAccountDeviceEvent.CARD_TAPPED,
        ),
      });
    } else {
      actions.push({
        id: '3',
        text: lang.strings.addAccount.deviceActions.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          selectedWallet?.hasPassphrase
            ? CreateAccountDeviceEvent.PASSPHRASE_ENTERED
            : CreateAccountDeviceEvent.CONFIRMED,
          CreateAccountDeviceEvent.CARD_TAPPED,
        ),
      });
    }

    return actions;
  }, [deviceEvents]);

  const isProcessing = useMemo(
    () => deviceEvents[CreateAccountDeviceEvent.CARD_TAPPED] === true,
    [deviceEvents],
  );

  if (isProcessing) {
    return <LoaderDialog />;
  }

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={verifyCoinIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.addAccount.deviceActions.header} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text={lang.strings.addAccount.deviceActions.subtext} />
            <strong style={{ color: 'white' }}>
              {' '}
              <LangDisplay
                text={lang.strings.addAccount.deviceActions.walletName}
                variables={{ walletName: selectedWallet?.name }}
              />
            </strong>
          </Typography>
        </Container>
        <LeanBoxContainer>
          {actionsList.map(data => (
            <LeanBox {...data} key={data.id} />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
