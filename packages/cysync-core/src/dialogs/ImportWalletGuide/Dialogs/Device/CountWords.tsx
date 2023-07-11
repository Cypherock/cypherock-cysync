import { GuidedFlowDialogBox, countNumberOfWords } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const CountWords: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={countNumberOfWords}
      title={lang.strings.importWallet.device.countNumberOfWords.title}
      heading={lang.strings.importWallet.device.countNumberOfWords.heading}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
