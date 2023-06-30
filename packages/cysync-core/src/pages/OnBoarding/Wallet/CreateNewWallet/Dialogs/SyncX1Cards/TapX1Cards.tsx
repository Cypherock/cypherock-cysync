import React, { FC } from 'react';
import { syncX1Cards, CreateWalletDialogBoxLayout } from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { useCreateNewWallet } from '~/context/createNewWallet';

export const TapX1Cards: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
      image={syncX1Cards}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.syncX1Cards.heading}
      title={lang.strings.onboarding.createWallet.syncX1Cards.title}
      subTitle={lang.strings.onboarding.createWallet.syncX1Cards.subTitle}
      goldenArrowList={lang.strings.onboarding.createWallet.syncX1Cards.list}
    />
  );
};
