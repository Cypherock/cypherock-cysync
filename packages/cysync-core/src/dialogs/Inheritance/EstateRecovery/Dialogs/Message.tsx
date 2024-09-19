import {
  Button,
  Clipboard,
  Container,
  Flex,
  InputLabel,
  LangDisplay,
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
  const strings = lang.strings.dialogs.inheritanceEstateRecovery.viewMessage;
  const cardLocation = 'Some location';
  const personalMessage = 'Some Message';
  const userName = 'Alfred Ballows';
  return (
    <Layout
      footerComponent={
        <Button onClick={() => onNext()}>{lang.strings.buttons.next}</Button>
      }
    >
      <Container direction="row" gap={4}>
        <Typography $fontSize={20}>
          <LangDisplay text={strings.title} variables={{ name: userName }} />
        </Typography>
      </Container>
      <Container direction="column" gap={16} $flex={1} width="100%">
        <Container direction="column" $flex={1} width="100%">
          <Flex justify="space-between" align="center" width="100%" $flex={1}>
            <InputLabel>{strings.form.cardLocationField.label}</InputLabel>
            <Clipboard variant="gold" content={cardLocation} />
          </Flex>
          <TextAreaInput
            height={120}
            value={cardLocation}
            placeholder={strings.form.cardLocationField.placeholder}
          />
        </Container>
        <Container direction="column" $flex={1} width="100%">
          <Flex justify="space-between" align="center" width="100%" $flex={1}>
            <InputLabel>{strings.form.personalMessageField.label}</InputLabel>
            <Clipboard variant="gold" content={personalMessage} />
          </Flex>
          <TextAreaInput
            height={120}
            value={cardLocation}
            placeholder={strings.form.personalMessageField.placeholder}
          />
        </Container>
      </Container>
    </Layout>
  );
};
