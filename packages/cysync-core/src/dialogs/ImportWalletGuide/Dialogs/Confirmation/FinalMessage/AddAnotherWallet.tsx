import { GuidedFlowDialogBox, informationIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const AddAnotherWallet: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.importWallet.confirmation.finalMessage.addAnotherWallet
          .heading
      }
      title={
        lang.strings.importWallet.confirmation.finalMessage.addAnotherWallet
          .title
      }
      bulletList={
        lang.strings.importWallet.confirmation.finalMessage.addAnotherWallet
          .list
      }
    />
  );
};
