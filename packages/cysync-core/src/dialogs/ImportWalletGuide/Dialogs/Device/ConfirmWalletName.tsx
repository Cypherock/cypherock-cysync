import { confirmWalletName, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const ConfirmWalletName: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={confirmWalletName}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.importWallet.device.confirmWallet.heading}
      title={lang.strings.importWallet.device.confirmWallet.title}
    />
  );
};
