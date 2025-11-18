import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap, coinList } from '@cypherock/coins';
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
  VerifyAmountDeviceGraphics,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { CoinIcon, LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useCreateCantonAccountDialog } from '../context';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DeviceAction: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.x1Vault;
  const {
    onNext,
    deviceEvents,
    selectedWallet,
    selectedAccount,
    transaction,
    prepare,
    startFlow,
  } = useCreateCantonAccountDialog();

  const assetName = coinList[coinFamiliesMap.canton].name;

  useEffect(() => {
    if (deviceEvents[SignTransactionDeviceEvent.CARD_TAPPED]) {
      onNext();
    }
  }, [deviceEvents]);

  useEffect(() => {
    if (transaction) {
      startFlow();
    }
  }, [transaction]);

  useEffect(() => {
    prepare();
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
        text: displayText.actions.verifyCoin,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          SignTransactionDeviceEvent.INIT,
          SignTransactionDeviceEvent.CONFIRMED,
        ),
        altText: assetName,
        image: (
          <CoinIcon parentAssetId={selectedAccount?.parentAssetId ?? ''} />
        ),
      },
    ];

    if (selectedWallet?.hasPassphrase) {
      actions.push({
        id: '2',
        text: displayText.actions.enterPassphrase,
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
        text: displayText.actions.enterPin,
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
        text: displayText.actions.tapCard,
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

  if (transaction === undefined) return <LoaderDialog />;

  return (
    <DialogBox width={600}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <VerifyAmountDeviceGraphics />
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
      </DialogBoxBody>
    </DialogBox>
  );
};
