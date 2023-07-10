import { GuidedFlowDialogBox, successIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateWalletGuide } from '~/context/createWalletGuide';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletNote: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={successIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.onboarding.createWallet.walletCreationSuccess.heading
      }
      title={
        lang.strings.onboarding.createWallet.walletCreationSuccess.titles.second
      }
    />
  );
};
