import { syncX1Cards, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const TapX1Cards: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={syncX1Cards}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.importWallet.syncX1Cards.heading}
      title={lang.strings.importWallet.syncX1Cards.title}
      subTitle={lang.strings.importWallet.syncX1Cards.subTitle}
      goldenArrowList={lang.strings.importWallet.syncX1Cards.list}
    />
  );
};
