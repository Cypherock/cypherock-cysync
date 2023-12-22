import {
  PasswordInput,
  DialogBoxFooter,
  Button,
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  Container,
  PasswordGraphics,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { routes } from '~/constants';
import { useLockscreen } from '~/context';
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { setPassword: updatePassword } = useLockscreen();

  const tryStoringPassword: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    if (isLoading) return;

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
    const updated = await updatePassword(password);
    setIsLoading(false);
    if (updated) {
      passwordSetter(true);
      navigateTo(routes.onboarding.emailAuth.path, 3000);
    } else {
      setErrorMessage("Couldn't store password");
    }
  };

  return (
    <DialogBox width={500}>
      <form onSubmit={tryStoringPassword}>
        <DialogBoxBody>
          <PasswordGraphics width={48} />
          <Flex direction="column" gap={4}>
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={lang.strings.onboarding.setPassword.title} />
            </Typography>
            <Typography variant="h6" $textAlign="center" mb={2} color="muted">
              <LangDisplay
                text={lang.strings.onboarding.setPassword.subtitle}
              />
            </Typography>
          </Flex>
          <Flex direction="column" gap={16} width="full">
            <PasswordInput
              name="password"
              label={lang.strings.onboarding.setPassword.newPasswordLabel}
              value={password}
              onChange={setPassword}
              disabled={isLoading}
            />
            <PasswordInput
              name="confirm password"
              label={lang.strings.onboarding.setPassword.confirmPasswordLabel}
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={isLoading}
            />
            {errorMessage.length > 0 && (
              <Container display="block" $borderWidthT={1} py={3}>
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
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {lang.strings.buttons.confirm}
          </Button>
        </DialogBoxFooter>
      </form>
    </DialogBox>
  );
};
