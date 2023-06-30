import React, { FC } from 'react';
import {
  confirmWalletName,
  CreateWalletDialogBoxLayout,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { useCreateNewWallet } from '~/context/createNewWallet';

export const ConfirmWalletName: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
      image={confirmWalletName}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.confirmWallet.heading}
      title={lang.strings.onboarding.createWallet.confirmWallet.title}
    />
  );
};
