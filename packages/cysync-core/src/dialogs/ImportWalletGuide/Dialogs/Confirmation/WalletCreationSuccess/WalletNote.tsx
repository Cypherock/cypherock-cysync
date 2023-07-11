import { GuidedFlowDialogBox, successIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletNote: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={successIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.importWallet.confirmation.walletCreationSuccess.heading
      }
      title={
        lang.strings.importWallet.confirmation.walletCreationSuccess.titles
          .second
      }
    />
  );
};
