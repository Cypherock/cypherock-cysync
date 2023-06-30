import React, { FC } from 'react';
import { setupPin, CreateWalletDialogBoxLayout } from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { useCreateNewWallet } from '~/context/createNewWallet';

export const SetupWalletPin: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
      image={setupPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.enterPin.heading}
      title={lang.strings.onboarding.createWallet.enterPin.title}
      subTitle={lang.strings.onboarding.createWallet.enterPin.subTitle}
      bulletList={lang.strings.onboarding.createWallet.enterPin.list}
      infoText={lang.strings.onboarding.createWallet.enterPin.note}
      infoColor="yellow"
    />
  );
};
