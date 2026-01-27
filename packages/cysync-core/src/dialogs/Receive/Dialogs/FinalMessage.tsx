import { coinFamiliesMap } from '@cypherock/coins';
import {
  DialogBox,
  DialogBoxBody,
  Image,
  DialogBoxFooter,
  Button,
  circledCheckIcon,
  MessageBox,
  Typography,
  LangDisplay,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useState } from 'react';

import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { ILangState, selectLanguage, useAppSelector } from '~/store';

import { AddressDisplay } from './Components';

import { useReceiveDialog } from '../context';

const getDisplayTexts = (
  lang: ILangState,
  showAccountId: boolean,
  isAddressVerified: boolean,
  derivedAddress?: string,
  derivedAccountId?: string,
  derivedPrincipalId?: string,
  selectedAccount?: IAccount,
) => {
  const texts = lang.strings.receive.receive;
  const buttons = lang.strings.receive.finalButtons;

  let congratsTitle = lang.strings.receive.congrats.title;
  let messageBoxWarining = texts.messageBox.warning;
  let secondaryBtnUnverifedText = buttons.secondaryUnverified;
  let titlePrefix = texts.title.prefix;
  let { addressLabel } = texts;
  let address = derivedAddress;

  const isIcpAccount = selectedAccount?.familyId === coinFamiliesMap.icp;
  const isCantonAccount = selectedAccount?.familyId === coinFamiliesMap.canton;

  if (isIcpAccount) {
    congratsTitle = lang.strings.receive.congrats.accountAndPrincipalIdTitle;
    messageBoxWarining = texts.messageBox.principalIdWarning;
    secondaryBtnUnverifedText = buttons.secondaryUnverifiedPrincipalId;
    titlePrefix = texts.title.principalIdPrefix;
    addressLabel = texts.principalIdLabel;
    address = derivedPrincipalId;

    if (showAccountId) {
      messageBoxWarining =
        lang.strings.receive.receive.messageBox.accountIdWarning;
      secondaryBtnUnverifedText = buttons.secondaryUnverifiedAccountId;
      titlePrefix = texts.title.accountIdPrefix;
      addressLabel = texts.accountIdLabel;
      address = derivedAccountId;
    }
  } else if (isCantonAccount) {
    congratsTitle = lang.strings.receive.congrats.partyIdTitle;
    messageBoxWarining = texts.messageBox.partyIdWarning;
    secondaryBtnUnverifedText = buttons.secondaryUnverifiedPartyId;
    titlePrefix = texts.title.partyIdPrefix;
    addressLabel = texts.partyIdLabel;
  }

  return {
    congratsTitle,
    messageBoxWarining,
    secondaryBtnUnverifedText,
    addressLabel,
    titlePrefix,
    titleSuffix: texts.title.suffix,
    primaryBtnText: buttons.primary,
    continueBtnText: buttons.continue,
    secondaryBtnText: isAddressVerified
      ? buttons.secondary
      : secondaryBtnUnverifedText,
    address: address ?? '',
  };
};

export const FinalMessage: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const {
    onRetry,
    onClose,
    isAddressVerified,
    selectedAccount,
    derivedAddress,
    derivedAccountId,
    derivedPrincipalId,
  } = useReceiveDialog();

  const isIcpAccount = selectedAccount?.familyId === coinFamiliesMap.icp;
  const [showAccountId, setShowAccountId] = useState<boolean>(
    isIcpAccount && !isAddressVerified,
  );

  const displayTexts = getDisplayTexts(
    lang,
    showAccountId,
    isAddressVerified,
    derivedAddress,
    derivedAccountId,
    derivedPrincipalId,
    selectedAccount,
  );

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        {isAddressVerified && <Image src={circledCheckIcon} alt="Check Icon" />}
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            {isAddressVerified ? (
              <Typography variant="h5" $textAlign="center">
                <LangDisplay text={displayTexts.congratsTitle} />
              </Typography>
            ) : (
              <>
                <AddressDisplay
                  titlePrefix={displayTexts.titlePrefix}
                  titleSuffix={displayTexts.titleSuffix}
                  addressLabel={displayTexts.addressLabel}
                  address={displayTexts.address}
                />
                <MessageBox
                  text={displayTexts.messageBoxWarining}
                  type="danger"
                />
              </>
            )}
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          onClick={() => {
            analyticsService.trackEvent(ANALYTICS_EVENTS.RECEIVE_RETRY_ACTION, {
              assetId: selectedAccount?.assetId,
              isAddressVerified,
              action: 'retry',
            });
            onRetry();
          }}
        >
          {displayTexts.secondaryBtnText}
        </Button>
        {(!showAccountId || isAddressVerified) && (
          <Button
            variant="primary"
            onClick={() => {
              analyticsService.trackEvent(ANALYTICS_EVENTS.RECEIVE_SUCCEEDED, {
                assetId: selectedAccount?.assetId,
                isAddressVerified,
                action: 'completed',
              });
              onClose();
            }}
          >
            {displayTexts.primaryBtnText}
          </Button>
        )}
        {showAccountId && !isAddressVerified && (
          <Button
            variant="primary"
            onClick={() => {
              analyticsService.trackEvent(
                ANALYTICS_EVENTS.RECEIVE_CONTINUE_ACTION,
                {
                  assetId: selectedAccount?.assetId,
                  action: 'continue',
                },
              );
              setShowAccountId(false);
            }}
          >
            {displayTexts.continueBtnText}
          </Button>
        )}
      </DialogBoxFooter>
    </DialogBox>
  );
};
