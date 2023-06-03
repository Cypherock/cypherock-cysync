import {
  Typography,
  Image,
  successIcon,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useAppSelector, selectLanguage } from '~/store';

export const Success: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={successIcon} alt="Success Icon" />
        <Typography variant="h6" $textAlign="center">
          <LangDisplay text={lang.strings.onboarding.deviceAuth.success} />
        </Typography>
      </DialogBoxBody>
    </DialogBox>
  );
};
