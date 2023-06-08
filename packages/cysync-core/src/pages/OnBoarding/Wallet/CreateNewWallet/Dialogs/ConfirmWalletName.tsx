import React, { Dispatch, FC, SetStateAction } from 'react';
import { confirmWalletName } from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { DialogBoxLayout } from '../DialogBoxLayout';

export const ConfirmWalletName: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <DialogBoxLayout
      setState={setState}
      heading={lang.strings.onboarding.createWallet.confirmWallet.heading}
      image={confirmWalletName}
      title={lang.strings.onboarding.createWallet.confirmWallet.title}
    />
  );
};
