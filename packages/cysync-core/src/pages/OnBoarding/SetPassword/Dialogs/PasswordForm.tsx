import {
  QuestionMarkButton,
  DialogBoxFooter,
  Button,
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  Container,
  LabeledInput,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';

import { useAppSelector, selectLanguage } from '~/store';
import { validatePassword } from '~/utils';

export const PasswordForm: React.FC<{
  passwordSetter: (val: boolean) => void;
}> = ({ passwordSetter }) => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const tryStoringPassword = async () => {
    const validation = validatePassword(
      { password, confirm: confirmPassword },
      lang,
    );
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      return;
    }
    // store password hash here
    passwordSetter(true);
    navigateTo(routes.onboarding.emailAuth.path, 3000);
  };

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Typography variant="h5" $textAlign="center" mb={2}>
          <LangDisplay text={lang.strings.onboarding.setPassword.title} /> (
          <QuestionMarkButton />)
        </Typography>
        <Flex direction="column" gap={16} width="full" mb={7}>
          <LabeledInput
            type="password"
            label={lang.strings.onboarding.setPassword.newPasswordLabel}
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <LabeledInput
            type="password"
            label={lang.strings.onboarding.setPassword.confirmPasswordLabel}
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
          />
          {errorMessage && (
            <Container display="block" border="top" py={3}>
              <Typography
                variant="h6"
                color="error"
                $fontWeight="light"
                $textAlign="left"
              >
                {errorMessage}
              </Typography>
            </Container>
          )}
        </Flex>
        <Container display="block" border="bottom" pb={2}>
          <Typography variant="fineprint" color="muted" $textAlign="center">
            {lang.strings.onboarding.setPassword.hint}
          </Typography>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          onClick={() => navigateTo(routes.onboarding.emailAuth.path)}
        >
          Skip
        </Button>
        <Button variant="primary" onClick={tryStoringPassword}>
          Confirm
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
