import {
  Button,
  Container,
  InputLabel,
  MessageBox,
  TextAreaInput,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const Message = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext } = useInheritanceEstateRecoveryDialog();
  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.decryptedMessage;
  const cardLocation = 'Some location';
  return (
    <Layout
      footerComponent={
        <Button onClick={() => onNext()}>{lang.strings.buttons.next}</Button>
      }
    >
      <Container direction="column">
        <Typography $fontSize={20}>{strings.title}</Typography>
      </Container>
      <Container direction="column" gap={16} $flex={1} width="100%">
        <Container direction="column" gap={8} $flex={1} width="100%">
          <InputLabel>{strings.form.cardLocationField.label}</InputLabel>
          <TextAreaInput
            height={120}
            value={cardLocation}
            placeholder={strings.form.cardLocationField.placeholder}
          />
        </Container>
        <Container direction="column" gap={8} $flex={1} width="100%">
          <InputLabel>{strings.form.personalMessageField.label}</InputLabel>
          <TextAreaInput
            height={120}
            value={cardLocation}
            placeholder={strings.form.personalMessageField.placeholder}
          />
        </Container>
      </Container>
      <MessageBox type="info" text={strings.messageBox.info} />
    </Layout>
  );
};
