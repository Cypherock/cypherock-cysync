import React, { FC } from 'react';
import { confirmPin, CreateWalletDialogBoxLayout } from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { useCreateNewWallet } from '~/context/createNewWallet';

export const ConfirmPin: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
      image={confirmPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.confirmPin.heading}
      isLoading
      loadingText={lang.strings.onboarding.createWallet.confirmPin.loading}
      title={lang.strings.onboarding.createWallet.confirmPin.title}
      bulletList={lang.strings.onboarding.createWallet.confirmPin.list}
    />
  );
};
