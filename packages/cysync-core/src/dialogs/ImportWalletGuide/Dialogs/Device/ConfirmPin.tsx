import { confirmPin, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const ConfirmPin: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={confirmPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.importWallet.device.confirmPin.heading}
      isLoading
      loadingText={lang.strings.importWallet.device.confirmPin.loading}
      title={lang.strings.importWallet.device.confirmPin.title}
      bulletList={lang.strings.importWallet.device.confirmPin.list}
    />
  );
};
