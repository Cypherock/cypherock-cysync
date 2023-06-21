import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  confirmWalletName,
  CreateWalletDialogBoxLayout,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';

export const ConfirmWalletName: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ state, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      state={state}
      setState={setState}
      heading={lang.strings.onboarding.createWallet.confirmWallet.heading}
      image={confirmWalletName}
      title={lang.strings.onboarding.createWallet.confirmWallet.title}
    />
  );
};
