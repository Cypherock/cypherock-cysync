import {
  Typography,
  Image,
  successIcon,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const Success: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={successIcon} alt="Success Icon" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay
            text={lang.strings.onboarding.joystickTraining.success}
          />
        </Typography>
      </DialogBoxBody>
    </DialogBox>
  );
};
