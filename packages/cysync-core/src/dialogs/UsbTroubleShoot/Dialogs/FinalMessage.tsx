import {
  Flex,
  Button,
  LangDisplay,
  GenerateNewWalletDeviceGraphics,
  CustomFlowDialogBox,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useState } from 'react';

import { ContactSupportDialogProvider } from '~/dialogs/ContactSupport/context';
import { ContactForm } from '~/dialogs/ContactSupport/Dialogs';
import { useTroubleShoot } from '~/dialogs/UsbTroubleShoot/context';
import { selectLanguage, selectWallets, useAppSelector } from '~/store';

const selectWalletsAndLang = createSelector(
  [selectLanguage, selectWallets],
  (a, b) => ({ lang: a, ...b }),
);

const informationIconReactElement = <GenerateNewWalletDeviceGraphics />;

interface ButtonsProps {
  setShowContactForm: (show: boolean) => void;
}

const Buttons: FC<ButtonsProps> = ({ setShowContactForm }) => {
  const { onCloseDialog } = useTroubleShoot();
  const { lang } = useAppSelector(selectWalletsAndLang);

  const handlePrimaryClick = () => {
    setShowContactForm(true);
  };

  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary" onClick={onCloseDialog}>
        <LangDisplay
          text={lang.strings.usbtroubleShoot.finalIssue.buttons.secondary}
        />
      </Button>
      <Button variant="primary" onClick={handlePrimaryClick}>
        <LangDisplay
          text={lang.strings.usbtroubleShoot.finalIssue.buttons.primary}
        />
      </Button>
    </Flex>
  );
};

export const FinalMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useTroubleShoot();
  const [showContactForm, setShowContactForm] = useState(false);

  return showContactForm ? (
    <ContactSupportDialogProvider>
      <ContactForm key="contact-support-form" />
    </ContactSupportDialogProvider>
  ) : (
    <CustomFlowDialogBox
      image={informationIconReactElement}
      onNext={onNext}
      onPrevious={onPrevious}
      title={lang.strings.usbtroubleShoot.finalIssue.title}
      subtitle={lang.strings.usbtroubleShoot.finalIssue.subtitle}
      footer={<Buttons setShowContactForm={setShowContactForm} />}
    />
  );
};
