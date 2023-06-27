import {
  PasswordInput,
  QuestionMarkButton,
  DialogBoxFooter,
  Button,
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  Container,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';

import { useAppSelector, selectLanguage } from '~/store';
import { validatePassword } from '~/utils';
import { changePassword } from '~/utils/password';

export const PasswordForm: React.FC<{
  passwordSetter: (val: boolean) => void;
}> = ({ passwordSetter }) => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const tryStoringPassword: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    if (isLoading) return;

    event.preventDefault();
    setIsLoading(true);

    const validation = validatePassword(
      { password, confirm: confirmPassword },
      lang,
    );
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      setIsLoading(false);
      return;
    }
    await changePassword(password);
    passwordSetter(true);
    setIsLoading(false);
    navigateTo(routes.onboarding.emailAuth.path);
  };

  return (
    <DialogBox width={500}>
      <form onSubmit={tryStoringPassword}>
        <DialogBoxBody>
          <Flex direction="column" gap={4}>
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={lang.strings.onboarding.setPassword.title} /> (
              <QuestionMarkButton />)
            </Typography>
            <Typography variant="h6" $textAlign="center" mb={2} color="muted">
              <LangDisplay
                text={lang.strings.onboarding.setPassword.subtitle}
              />
            </Typography>
          </Flex>
          <Flex direction="column" gap={16} width="full">
            <Flex direction="column" gap={8}>
              <PasswordInput
                name="password"
                label={lang.strings.onboarding.setPassword.newPasswordLabel}
                value={password}
                onChange={setPassword}
              />
            </Flex>
            <Flex direction="column" gap={8}>
              <PasswordInput
                name="confirm password"
                label={lang.strings.onboarding.setPassword.confirmPasswordLabel}
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </Flex>
            {errorMessage.length > 0 && (
              <Container display="block" border="top" py={3}>
                <Typography
                  key={errorMessage}
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
          <Container display="block" pb={2}>
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
            {lang.strings.buttons.skip}
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {lang.strings.buttons.confirm}
          </Button>
        </DialogBoxFooter>
      </form>
    </DialogBox>
  );
};
