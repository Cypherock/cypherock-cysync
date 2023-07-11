import { enterWalletName, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const EnterWalletName: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={enterWalletName}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.importWallet.device.enterWalletName.heading}
      title={lang.strings.importWallet.device.enterWalletName.title}
      bulletList={lang.strings.importWallet.device.enterWalletName.list}
      infoText={lang.strings.importWallet.device.enterWalletName.note}
      infoIconVariant="white"
      infoTextVariant="white"
    />
  );
};
