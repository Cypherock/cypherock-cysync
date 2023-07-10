import { confirmWalletName, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const ConfirmWalletName: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <GuidedFlowDialogBox
      image={confirmWalletName}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.confirmWallet.heading}
      title={lang.strings.onboarding.createWallet.confirmWallet.title}
    />
  );
};
