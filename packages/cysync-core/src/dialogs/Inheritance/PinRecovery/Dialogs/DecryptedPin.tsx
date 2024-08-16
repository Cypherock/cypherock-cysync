import {
  AccountIcon,
  Container,
  ErrorDialog,
  MessageBox,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const DecryptedPin = () => {
  const lang = useAppSelector(selectLanguage);

  const { onNext } = useInheritancePinRecoveryDialog();

  const strings = lang.strings.dialogs.inheritancePinRecovery.viewPin;

  const error = false;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (error) {
    return (
      <ErrorDialog
        title={strings.error.title}
        advanceText={strings.error.subTitle}
        primaryActionText={lang.strings.buttons.retry}
        onPrimaryClick={() => {
          // TODO: implement this function
        }}
        secondaryActionText={lang.strings.buttons.exit}
        onSecondaryClick={() => {
          // TODO: implement this function
        }}
      />
    );
  }

  return (
    <Layout>
      <Container direction="column">
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.decrypted.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted" mb={2}>
          {strings.decrypted.subTitle}
        </Typography>
      </Container>
      <MessageBox
        type="success"
        icon={<AccountIcon />}
        text={strings.decrypted.messageBox.info}
      />
    </Layout>
  );
};
