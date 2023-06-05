import {
  Typography,
  Image,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  loader,
  getDefaultTheme,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useAppSelector, selectLanguage } from '~/store';

export const Authenticating: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const theme = getDefaultTheme();

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={loader} alt="loader" animate="spin" $animDuration={3} />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={lang.strings.onboarding.deviceAuth.subtext} />
          ...(
          <span
            style={{
              background: theme.palette.golden,
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
            }}
          >
            ?
          </span>
          )
        </Typography>
      </DialogBoxBody>
    </DialogBox>
  );
};
