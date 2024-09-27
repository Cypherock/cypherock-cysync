import {
  Button,
  Container,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditEncryptedMessageDialog } from '../context';
import { Layout } from '../Layout';

export const Confirmation = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritanceEditEncryptedMessage;
  const { onNext, onClose } = useInheritanceEditEncryptedMessageDialog();

  return (
    <Layout
      width={600}
      onClose={onClose}
      footerComponent={
        <>
          <Button onClick={() => onClose()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.no} />
          </Button>
          <Button onClick={() => onNext()} variant="primary">
            <LangDisplay text={lang.strings.buttons.yes} />
          </Button>
        </>
      }
    >
      <Container direction="column" gap={4}>
        <Typography
          variant="h5"
          color="heading"
          $textAlign="center"
          $fontSize={20}
        >
          <LangDisplay text={strings.confirmation.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.confirmation.subTitle} />
        </Typography>
      </Container>
    </Layout>
  );
};

export default Confirmation;
