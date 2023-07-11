import { GuidedFlowDialogBox, pinDeviceConsent } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletPinConsent: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={pinDeviceConsent}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.importWallet.device.setupPinConsent.heading}
      title={lang.strings.importWallet.device.setupPinConsent.title}
      subTitle={lang.strings.importWallet.device.setupPinConsent.subTitle}
    />
  );
};
