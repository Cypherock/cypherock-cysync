import {
  QuestionMarkButton,
  Typography,
  Image,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  loader,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useAppSelector, selectLanguage } from '~/store';

export const DeviceAuthenticating: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={loader} alt="loader" animate="spin" $animDuration={3} />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={lang.strings.onboarding.deviceAuth.subtext} />
          ...
          <QuestionMarkButton />
        </Typography>
      </DialogBoxBody>
    </DialogBox>
  );
};
