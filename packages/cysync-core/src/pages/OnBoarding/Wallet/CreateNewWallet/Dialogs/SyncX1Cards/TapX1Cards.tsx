import { syncX1Cards, GuidedFlowDialogBoxLayout } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const TapX1Cards: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <GuidedFlowDialogBoxLayout
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
