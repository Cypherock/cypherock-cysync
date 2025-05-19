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
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';
import { validateInputLanguage } from '~/utils';

import { useInheritanceEditEncryptedMessageDialog } from '../context';
import { Layout } from '../Layout';

export const EditMessage = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEditEncryptedMessage.editMessage;
  const { onNext, onClose, encryptedMessage, setEncryptedMessage } =
    useInheritanceEditEncryptedMessageDialog();

  const { cardLocation } = encryptedMessage;
  const { personalMessage } = encryptedMessage;

  const [cardLocationError, setCardLocationError] = useState<string>('');
  const [personalMessageError, setPersonalMessageError] = useState<string>('');

  const isNextDisabled = useMemo(
    () =>
      !personalMessage.trim() ||
      !cardLocation.trim() ||
      !!cardLocationError ||
      !!personalMessageError,
    [personalMessage, cardLocation, cardLocationError, personalMessageError],
  );

  const validateFields = debounce(() => {
    const cardLocationValidation = validateInputLanguage(cardLocation, lang);
    const personalMessageValidation = validateInputLanguage(
      personalMessage,
      lang,
    );

    if (!cardLocationValidation.success) {
      setCardLocationError(cardLocationValidation.error.errors[0].message);
    } else {
      setCardLocationError('');
    }

    if (!personalMessageValidation.success) {
      setPersonalMessageError(
        personalMessageValidation.error.errors[0].message,
      );
    } else {
      setPersonalMessageError('');
    }
  }, 300);

  useEffect(() => {
    validateFields();

    return () => {
      validateFields.cancel();
    };
  }, [cardLocation, personalMessage]);

  return (
    <Layout
      footerComponent={
        <>
          <Button variant="secondary" onClick={() => onClose()}>
            <LangDisplay text={lang.strings.buttons.exitWithoutSaving} />
          </Button>
          <Button onClick={() => onNext()} disabled={isNextDisabled}>
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
            currentChars={cardLocation.length ?? 0}
            value={cardLocation}
            onChange={text =>
              setEncryptedMessage({ ...encryptedMessage, cardLocation: text })
            }
            error={cardLocationError}
            autoFocus
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
            currentChars={personalMessage.length ?? 0}
            value={personalMessage}
            onChange={text =>
              setEncryptedMessage({
                ...encryptedMessage,
                personalMessage: text,
              })
            }
            error={personalMessageError}
          />
        </Container>
      </Container>
      <MessageBox type="warning" text={strings.messageBox.warning} />
    </Layout>
  );
};

export default EditMessage;
