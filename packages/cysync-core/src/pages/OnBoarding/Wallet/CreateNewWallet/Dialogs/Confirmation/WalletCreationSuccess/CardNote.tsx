import {
  CreateWalletDialogBoxLayout,
  successIcon,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { useTheme } from 'styled-components';
import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const CardNote: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const theme = useTheme();
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <CreateWalletDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.walletCreationSuccess.heading
      }
      image={successIcon}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <Typography px={5} $textAlign="center" variant="h5">
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
