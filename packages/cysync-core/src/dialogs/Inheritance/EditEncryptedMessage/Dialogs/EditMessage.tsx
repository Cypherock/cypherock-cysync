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
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditEncryptedMessageDialog } from '../context';
import { Layout } from '../Layout';

export const EditMessage = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEditEncryptedMessage.editMessage;
  const { onNext, onClose, encryptedMessage, setEncryptedMessage } =
    useInheritanceEditEncryptedMessageDialog();

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
            maxChars={800}
            currentChars={encryptedMessage.cardLocation.length ?? 0}
            value={encryptedMessage.cardLocation}
            onChange={text =>
              setEncryptedMessage({ ...encryptedMessage, cardLocation: text })
            }
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
            maxChars={800}
            currentChars={encryptedMessage.personalMessage.length ?? 0}
            value={encryptedMessage.personalMessage}
            onChange={text =>
              setEncryptedMessage({
                ...encryptedMessage,
                personalMessage: text,
              })
            }
          />
        </Container>
      </Container>
      <MessageBox type="warning" text={strings.messageBox.warning} />
    </Layout>
  );
};

export default EditMessage;
