import {
  Flex,
  Button,
  LangDisplay,
  GenerateNewWalletDeviceGraphics,
  UsbTroubleShootDialogBox,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC } from 'react';

import { useTroubleShoot } from '~/dialogs/UsbTroubleShoot/context';
import { selectLanguage, selectWallets, useAppSelector } from '~/store';

const selectWalletsAndLang = createSelector(
  [selectLanguage, selectWallets],
  (a, b) => ({ lang: a, ...b }),
);

const informationIconReactElement = <GenerateNewWalletDeviceGraphics />;

const Buttons: FC = () => {
  const { onCloseDialog } = useTroubleShoot();
  const { lang } = useAppSelector(selectWalletsAndLang);

  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary" onClick={onCloseDialog}>
        <LangDisplay
          text={lang.strings.usbtroubleShoot.finalIssue.buttons.secondary}
        />
      </Button>
      <Button variant="primary">
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

  return (
    <UsbTroubleShootDialogBox
      image={informationIconReactElement}
      onNext={onNext}
      onPrevious={onPrevious}
      title={lang.strings.usbtroubleShoot.finalIssue.title}
      subtitle={lang.strings.usbtroubleShoot.finalIssue.subtitle}
      footer={<Buttons />}
    />
  );
};
