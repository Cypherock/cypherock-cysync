import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import { coinList } from '@cypherock/coins';
import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Container,
  LeanBoxContainer,
  LeanBox,
  Throbber,
  LeanBoxProps,
  ArrowRightIcon,
  Check,
  verifyAmountIcon,
  MessageBox,
  Image,
  questionMarkGoldIcon,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { CoinIcon } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../context';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DeviceAction: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const { onNext, deviceEvents, selectedWallet, selectedAccount, startFlow } =
    useSendDialog();

  useEffect(() => {
    if (deviceEvents[SignTransactionDeviceEvent.CARD_TAPPED]) {
      onNext();
    }
  }, [deviceEvents]);

  useEffect(() => {
    startFlow();
  }, []);

  const getDeviceEventIcon = (
    loadingEvent: SignTransactionDeviceEvent,
    completedEvent: SignTransactionDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIconComponent;
    if (deviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: lang.strings.send.x1Vault.actions.verifyCoin,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          SignTransactionDeviceEvent.INIT,
          SignTransactionDeviceEvent.CONFIRMED,
        ),
        altText: coinList[selectedAccount?.assetId ?? ''].name,
        image: (
          <CoinIcon parentAssetId={selectedAccount?.parentAssetId ?? ''} />
        ),
      },
      {
        id: '4',
        leftImage: rightArrowIcon,
        text: lang.strings.send.x1Vault.actions.verifyDetails,
        rightImage: getDeviceEventIcon(
          SignTransactionDeviceEvent.CONFIRMED,
          SignTransactionDeviceEvent.VERIFIED,
        ),
      },
    ];

    if (selectedWallet?.hasPassphrase) {
      actions.push({
        id: '2',
        text: lang.strings.receive.x1Vault.actions.enterPassphrase,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          SignTransactionDeviceEvent.VERIFIED,
          SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
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
            ? SignTransactionDeviceEvent.PASSPHRASE_ENTERED
            : SignTransactionDeviceEvent.VERIFIED,
          SignTransactionDeviceEvent.CARD_TAPPED,
        ),
      });
    } else {
      actions.push({
        id: '3',
        text: lang.strings.receive.x1Vault.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          selectedWallet?.hasPassphrase
            ? SignTransactionDeviceEvent.PASSPHRASE_ENTERED
            : SignTransactionDeviceEvent.VERIFIED,
          SignTransactionDeviceEvent.CARD_TAPPED,
        ),
      });
    }

    return actions;
  }, [deviceEvents]);

  const displayText = lang.strings.send.x1Vault;
  return (
    <DialogBox width={600}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={verifyAmountIcon} alt="Verify Amount" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={displayText.title} />
          </Typography>
        </Container>
        <LeanBoxContainer>
          {actionsList.map(data => (
            <LeanBox
              key={data.id}
              leftImage={data.leftImage}
              rightImage={data.rightImage}
              text={data.text}
              image={data.image}
              altText={data.altText}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
        <Container display="flex" direction="column" gap={16} width="full">
          {selectedAccount?.parentAssetId ? (
            <MessageBox
              type="info"
              text="dummy"
              rightImage={
                <Image src={questionMarkGoldIcon} alt="question mark icon" />
              }
            />
          ) : undefined}
          <MessageBox type="warning" text={displayText.messageBox.warning} />
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
