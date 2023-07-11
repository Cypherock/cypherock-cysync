import { setupPin, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const SetupWalletPin: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={setupPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.importWallet.device.enterPin.heading}
      title={lang.strings.importWallet.device.enterPin.title}
      subTitle={lang.strings.importWallet.device.enterPin.subTitle}
      bulletList={lang.strings.importWallet.device.enterPin.list}
      infoText={lang.strings.importWallet.device.enterPin.note}
      infoTextVariant="muted"
      infoIconVariant="yellow"
    />
  );
};
