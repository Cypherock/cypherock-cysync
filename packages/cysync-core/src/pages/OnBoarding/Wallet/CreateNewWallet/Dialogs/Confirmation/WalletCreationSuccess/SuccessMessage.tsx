import {
  CreateWalletDialogBoxLayout,
  ConfettiBlast,
  successIcon,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessMessage: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.walletCreationSuccess.heading
      }
      title={
        lang.strings.onboarding.createWallet.walletCreationSuccess.titles.first
      }
      setState={setState}
      image={successIcon}
    >
      <ConfettiBlast />
    </CreateWalletDialogBoxLayout>
  );
};
