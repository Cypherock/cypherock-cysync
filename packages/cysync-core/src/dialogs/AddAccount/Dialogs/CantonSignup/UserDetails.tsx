import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Input,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

export const UserDetails = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.cantonSignup.userDetails;

  const { onPrevious, onNext } = useAddAccountDialog();

  const [email, setEmail] = useState('');

  return (
    <DialogBox width="800px" height="330px">
      <DialogBoxBody>
        <Flex direction="column" align="center" justify="center" $width="100%">
          <Typography $fontSize={20} $textAlign="center" color="white" mb="4px">
            {strings.title}
          </Typography>
          <Typography $fontSize={16} $textAlign="center" color="muted" mb={4}>
            {strings.subtext}
          </Typography>
          <Input
            name="email"
            type="email"
            label={strings.emailField.label}
            rightLabel={lang.strings.labels.required}
            value={email}
            onChange={setEmail}
            required
            showRequiredStar
            autoFocus
          />
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button onClick={() => onPrevious()} variant="secondary">
          <LangDisplay text={lang.strings.buttons.back} />
        </Button>
        <Button variant="primary" type="submit" onClick={() => onNext()}>
          <LangDisplay text="Send OTP" />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
