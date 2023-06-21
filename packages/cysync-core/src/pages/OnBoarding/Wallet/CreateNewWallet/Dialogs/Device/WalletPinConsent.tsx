import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  LangDisplay,
  Typography,
  CreateWalletDialogBoxLayout,
  pinDeviceConsent,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletPinConsent: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ state, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      state={state}
      setState={setState}
      heading={lang.strings.onboarding.createWallet.setupPinConsent.heading}
      image={pinDeviceConsent}
      title={lang.strings.onboarding.createWallet.setupPinConsent.title}
    >
      <Typography
        px={5}
        pt={{
          def: 2,
          lg: 6,
        }}
        $textAlign="center"
        color="muted"
      >
        <LangDisplay
          text={lang.strings.onboarding.createWallet.setupPinConsent.subTitle}
        />
      </Typography>
    </CreateWalletDialogBoxLayout>
  );
};
