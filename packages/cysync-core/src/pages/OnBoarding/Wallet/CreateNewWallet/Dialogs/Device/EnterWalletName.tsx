import React, { FC } from 'react';
import {
  enterWalletName,
  CreateWalletDialogBoxLayout,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { useCreateNewWallet } from '~/context/createNewWallet';

export const EnterWalletName: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
      image={enterWalletName}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.enterWalletName.heading}
      title={lang.strings.onboarding.createWallet.enterWalletName.title}
      bulletList={lang.strings.onboarding.createWallet.enterWalletName.list}
      infoText={lang.strings.onboarding.createWallet.enterWalletName.note}
      infoColor="white"
    />
  );
};
