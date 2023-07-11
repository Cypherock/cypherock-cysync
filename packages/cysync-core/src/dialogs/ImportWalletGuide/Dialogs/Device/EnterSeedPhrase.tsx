import { GuidedFlowDialogBox, enterSeedPhrase } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const EnterSeedPhrase: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={enterSeedPhrase}
      title={lang.strings.importWallet.device.enterSeedPhrase.title}
      heading={lang.strings.importWallet.device.enterSeedPhrase.heading}
      infoIconVariant="yellow"
      infoText={lang.strings.importWallet.device.enterSeedPhrase.note}
      showInfoIcon
      infoTextVariant="warn"
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
