import React, { FC } from 'react';
import { CreateWalletDialogBoxLayout, successIcon } from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { useCreateNewWallet } from '~/context/createNewWallet';

export const WalletNote: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
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
