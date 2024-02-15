import {
  Button,
  cysyncLockedLogo,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  LangDisplay,
  PasswordInput,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { useLockscreen } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import logger from '~/utils/logger';

export const Lockscreen: React.FC = () => {
  const { unlock } = useLockscreen();
  const lang = useAppSelector(selectLanguage);

  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [showForgotPasswordDialog, setShowForgotPasswordDialog] =
    useState(false);

  useEffect(() => {
    logger.info('Dialog: Navigation', {
      source: Lockscreen.name,
      dialogName: showForgotPasswordDialog
        ? ForgotPasswordDialog.name
        : Lockscreen.name,
    });
  }, [showForgotPasswordDialog]);

  const onPasswordSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    if (isLoading) return;

    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    const isCorrect = await unlock(password);
    logger.info('Form Submit: Lockscreen Password', {
      source: Lockscreen.name,
      isCorrect,
    });

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
      {!showForgotPasswordDialog ? (
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
                onChange={setPassword}
                value={password}
                disabled={isLoading}
              />
              <Button
                variant="none"
                $alignSelf="end"
                mt={1}
                onClick={() => setShowForgotPasswordDialog(true)}
              >
                <Typography
                  color="muted"
                  $fontSize={14}
                  $fontWeight="light"
                  $letterSpacing={0.12}
                >
                  <LangDisplay text={lang.strings.lockscreen.forgotPassword} />
                </Typography>
              </Button>

              {error && (
                <Typography
                  width="full"
                  pt={3}
                  $borderWidthT={1}
                  color="error"
                  $fontSize={16}
                  mt={2}
                  $textAlign="center"
                >
                  {error}
                </Typography>
              )}
            </DialogBoxBody>
            <DialogBoxFooter>
              <Button type="submit" isLoading={isLoading}>
                <LangDisplay text={lang.strings.lockscreen.button} />
              </Button>
            </DialogBoxFooter>
          </DialogBox>
        </form>
      ) : (
        <ForgotPasswordDialog
          onCancel={() => setShowForgotPasswordDialog(false)}
        />
      )}
    </Flex>
  );
};
