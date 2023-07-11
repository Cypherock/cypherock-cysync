import { GuidedFlowDialogBox, enterSeedPhrase } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const VerifySeedPhrase: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={enterSeedPhrase}
      title={lang.strings.importWallet.device.verifySeedPhrase.title}
      subTitle={lang.strings.importWallet.device.verifySeedPhrase.subTitle}
      heading={lang.strings.importWallet.device.verifySeedPhrase.heading}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
