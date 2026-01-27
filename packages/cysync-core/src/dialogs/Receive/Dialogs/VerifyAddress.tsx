import { ReceiveDeviceEvent } from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap } from '@cypherock/coins';
import {
  DialogBox,
  DialogBoxBody,
  Image,
  arrowGoldenForward,
  GenericConfirmDeviceGraphics,
  LeanBoxContainer,
  LeanBox,
  Throbber,
  ScrollableContainer,
  MessageBox,
} from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect } from 'react';

import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { ILangState, selectLanguage, useAppSelector } from '~/store';

import { AddressDisplay } from './Components';

import { useReceiveDialog } from '../context';

const getDisplayTexts = (lang: ILangState, selectedAccount?: IAccount) => {
  const { title, actions, waitMessageBox, addressLabel, partyIdLabel } =
    lang.strings.receive.receive;

  let label = addressLabel;
  let titlePrefix = title.prefix;
  let verifyActionText = actions.verify;

  if (selectedAccount && selectedAccount.familyId === coinFamiliesMap.canton) {
    label = partyIdLabel;
    titlePrefix = title.partyIdPrefix;
    verifyActionText = actions.verifyPartyId;
  }

  let waitMessage: string | undefined;
  if (
    selectedAccount &&
    selectedAccount.familyId === coinFamiliesMap.starknet
  ) {
    waitMessage = waitMessageBox.warning;
  }

  return {
    waitMessage,
    titlePrefix,
    verifyActionText,
    addressLabel: label,
    titleSuffix: title.suffix,
  };
};

export const VerifyAddress: React.FC = () => {
  const {
    onRetry,
    deviceEvents,
    isFlowCompleted,
    selectedAccount,
    derivedAddress,
    onAddressVerificationNext,
  } = useReceiveDialog();
  const lang = useAppSelector(selectLanguage);

  const displayTexts = getDisplayTexts(lang, selectedAccount);

  useEffect(() => {
    if (isFlowCompleted) {
      onRetry();
    }
  }, []);

  useEffect(() => {
    if (!isFlowCompleted && deviceEvents[ReceiveDeviceEvent.VERIFIED]) {
      analyticsService.trackEvent(
        ANALYTICS_EVENTS.RECEIVE_ADDRESS_VERIFIED_ON_DEVICE,
        {
          assetId: selectedAccount?.assetId,
          walletId: selectedAccount?.walletId,
        },
      );
      onAddressVerificationNext();
    }
  }, [deviceEvents]);

  const dataArray = [
    {
      id: '0',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: displayTexts.verifyActionText,
      rightImage: <Throbber size={15} strokeWidth={2} />,
    },
  ];

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        <GenericConfirmDeviceGraphics />
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            <AddressDisplay
              titlePrefix={displayTexts.titlePrefix}
              titleSuffix={displayTexts.titleSuffix}
              addressLabel={displayTexts.addressLabel}
              address={derivedAddress ?? ''}
            />
            <LeanBoxContainer>
              {dataArray.map(data => (
                <LeanBox
                  key={data.id}
                  leftImage={data.leftImage}
                  rightImage={data.rightImage}
                  text={data.text}
                  id={data.id}
                  px={6}
                />
              ))}
            </LeanBoxContainer>
            {displayTexts.waitMessage && (
              <MessageBox type="warning" text={displayTexts.waitMessage} />
            )}
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
