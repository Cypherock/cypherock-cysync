import {
  CreateWalletDialogBoxLayout,
  successIcon,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTheme } from 'styled-components';
import { selectLanguage, useAppSelector } from '~/store';

export const CardNote: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  const theme = useTheme();
  return (
    <CreateWalletDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.walletCreationSuccess.heading
      }
      setState={setState}
      image={successIcon}
    >
      <Typography px={8} $textAlign="center" variant="h5">
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.walletCreationSuccess.titles
              .third
          }
        />
        (
        <span
          style={{
            background: theme?.palette.golden,
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
        >
          ?
        </span>
        )
      </Typography>
    </CreateWalletDialogBoxLayout>
  );
};
