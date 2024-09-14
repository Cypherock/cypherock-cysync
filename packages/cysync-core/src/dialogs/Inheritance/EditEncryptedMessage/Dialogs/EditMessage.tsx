import React from 'react';
import { Layout } from '../Layout';
import { selectLanguage, useAppSelector } from '~/store';
import {
  Button,
  Container,
  Flex,
  InputLabel,
  LangDisplay,
  MessageBox,
  QuestionMarkButton,
  TextAreaInput,
  Tooltip,
  Typography,
} from '@cypherock/cysync-ui';
import { useInheritanceEditEncryptedMessageDialog } from '../context';

export const EditMessage = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEditEncryptedMessage.editMessage;
  const { onClose, onNext } = useInheritanceEditEncryptedMessageDialog();

  return (
    <Layout
      footerComponent={
        <>
          <Button variant="secondary" onClick={() => onClose()}>
            <LangDisplay text={lang.strings.buttons.exitWithoutSaving} />
          </Button>
          <Button onClick={() => onNext()}>
            <LangDisplay text={lang.strings.buttons.saveChanges} />
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
          <LangDisplay text={strings.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.subTitle} />
        </Typography>
      </Container>
      <Container direction="column" width="100%" $flex={1}>
        <Container direction="column" width="100%" $flex={1}>
          <InputLabel>
            <Flex gap={4} align="center">
              <LangDisplay text={strings.form.cardLocationField.label} />
              <Tooltip text={strings.form.cardLocationField.tooltip}>
                <QuestionMarkButton />
              </Tooltip>
            </Flex>
          </InputLabel>
          <TextAreaInput
            placeholder={strings.form.cardLocationField.placeholder}
            height={120}
          />
        </Container>
        <Container direction="column" width="100%" $flex={1}>
          <InputLabel>
            <Flex gap={4} align="center">
              <LangDisplay text={strings.form.personalMessageField.label} />
              <Tooltip text={strings.form.personalMessageField.tooltip}>
                <QuestionMarkButton />
              </Tooltip>
            </Flex>
          </InputLabel>
          <TextAreaInput
            placeholder={strings.form.personalMessageField.placeholder}
            height={120}
          />
        </Container>
      </Container>
      <MessageBox type="warning" text={strings.messageBox.warning} />
    </Layout>
  );
};

export default EditMessage;
