import {
  Button,
  Container,
  MessageBox,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const WalletTransfer = () => {
  const lang = useAppSelector(selectLanguage);

  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.confirmation.walletTransfer;

  const { onNext, onPrevious, onClose } = useInheritanceEstateRecoveryDialog();

  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => {
              onPrevious();
            }}
          >
            {lang.strings.buttons.back}
          </Button>
          <Button
            onClick={() => {
              onNext();
            }}
          >
            {lang.strings.buttons.next}
          </Button>
        </>
      }
    >
      <Container direction="column" mb={2}>
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted">
          {strings.subTitle}
        </Typography>
      </Container>
      <MessageBox type="warning" text={strings.messageBox.warning} />
    </Layout>
  );
};
