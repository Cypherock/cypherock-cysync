import {
  CreateWalletDialogBoxLayout,
  informationIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const AddAnotherWallet: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.onboarding.createWallet.finalMessage.addAnotherWallet
          .heading
      }
      title={
        lang.strings.onboarding.createWallet.finalMessage.addAnotherWallet.title
      }
      bulletList={
        lang.strings.onboarding.createWallet.finalMessage.addAnotherWallet.list
      }
    />
  );
};
