import {
  DialogBoxFooter,
  Button,
  DialogBox,
  DialogBoxBody,
  Flex,
  LangDisplay,
  Typography,
  cysyncLockedLogo,
  Image,
  PasswordInput,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { useLockscreen } from '~/context';
import { useAppSelector, selectLanguage } from '~/store';

export const Lockscreen: React.FC = () => {
  const { unlock } = useLockscreen();
  const lang = useAppSelector(selectLanguage);

  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onPasswordSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    if (isLoading) return;

    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    const isCorrect = await unlock(password);

    if (!isCorrect) {
      setError(lang.strings.lockscreen.incorrectPassword);
    }

    setIsLoading(false);
  };

  return (
    <Flex
      $bgColor="contentGradient"
      justify="center"
      align="center"
      width="screen"
      height="screen"
    >
      <form onSubmit={onPasswordSubmit}>
        <DialogBox width={500}>
          <DialogBoxBody gap={0}>
            <Image src={cysyncLockedLogo} alt="CySync Locked" mb={3} />
            <Typography variant="h5" $textAlign="center" color="muted" mb={6}>
              <LangDisplay text={lang.strings.lockscreen.title} />
            </Typography>

            <PasswordInput
              label={lang.strings.lockscreen.passwordLabel}
              name="password"
              placeholder="Password"
              onChange={setPassword}
              value={password}
              disabled={isLoading}
            />
            <Button type="button" variant="none" $alignSelf="end" mt={1}>
              <Typography
                color="muted"
                fontSize={14}
                font="light"
                $letterSpacing={0.12}
              >
                <LangDisplay text={lang.strings.lockscreen.forgotPassword} />
              </Typography>
            </Button>

            {error && (
              <Typography color="error" fontSize={16} mt={2}>
                {error}
              </Typography>
            )}
          </DialogBoxBody>
          <DialogBoxFooter>
            <Button type="submit" disabled={isLoading}>
              <LangDisplay text={lang.strings.lockscreen.button} />
            </Button>
          </DialogBoxFooter>
        </DialogBox>
      </form>
    </Flex>
  );
};
