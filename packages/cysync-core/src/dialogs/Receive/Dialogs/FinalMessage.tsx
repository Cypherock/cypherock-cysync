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
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AddressDisplay } from './Components';

import { useReceiveDialog } from '../context';

export const FinalMessage: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const texts = lang.strings.receive.receive;

  const buttons = lang.strings.receive.finalButtons;
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
  const congratsTitle = isIcpAccount
    ? lang.strings.receive.congrats.accountAndPrincipalIdTitle
    : lang.strings.receive.congrats.title;

  let messageBoxWarining = isIcpAccount
    ? lang.strings.receive.receive.messageBox.principalIdWarning
    : lang.strings.receive.receive.messageBox.warning;

  let secondaryBtnUnverifedText = isIcpAccount
    ? buttons.secondaryUnverifiedPrincipalId
    : buttons.secondaryUnverified;

  let titlePrefix = isIcpAccount
    ? texts.title.principalIdPrefix
    : texts.title.prefix;
  let addressLabel = isIcpAccount ? texts.principalIdLabel : texts.addressLabel;
  let address = isIcpAccount ? derivedPrincipalId : derivedAddress;

  const [showAccountId, setShowAccountId] = useState<boolean>(
    isIcpAccount && !isAddressVerified,
  );
  if (showAccountId) {
    messageBoxWarining =
      lang.strings.receive.receive.messageBox.accountIdWarning;
    secondaryBtnUnverifedText = buttons.secondaryUnverifiedAccountId;
    titlePrefix = texts.title.accountIdPrefix;
    addressLabel = texts.accountIdLabel;
    address = derivedAccountId;
  }

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        {isAddressVerified && <Image src={circledCheckIcon} alt="Check Icon" />}
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            {isAddressVerified ? (
              <Typography variant="h5" $textAlign="center">
                <LangDisplay text={congratsTitle} />
              </Typography>
            ) : (
              <>
                <AddressDisplay
                  titlePrefix={titlePrefix}
                  titleSuffix={texts.title.suffix}
                  addressLabel={addressLabel}
                  address={address ?? ''}
                />
                <MessageBox text={messageBoxWarining} type="danger" />
              </>
            )}
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={onRetry}>
          {isAddressVerified ? buttons.secondary : secondaryBtnUnverifedText}
        </Button>
        {(!showAccountId || isAddressVerified) && (
          <Button variant="primary" onClick={onClose}>
            {buttons.primary}
          </Button>
        )}
        {showAccountId && !isAddressVerified && (
          <Button variant="primary" onClick={() => setShowAccountId(false)}>
            {buttons.continue}
          </Button>
        )}
      </DialogBoxFooter>
    </DialogBox>
  );
};
