import {
  Button,
  CheckBox,
  Clipboard,
  Container,
  LangDisplay,
  QuestionMarkButton,
  TextAreaInput,
  Tooltip,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';
import { validateInputLanguage } from '~/utils';

export const Message = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, decryptedCardLocation, decryptedPersonalMessage } =
    useInheritanceEstateRecoveryDialog();
  const [isChecked, setIsChecked] = useState(false);
  const strings = lang.strings.dialogs.inheritanceEstateRecovery.viewMessage;

  const userName = 'Alfred Ballows';
  const cardLocation = decryptedCardLocation ?? '';
  const personalMessage = decryptedPersonalMessage ?? '';

  const [cardLocationError, setCardLocationError] = useState<string>('');
  const [personalMessageError, setPersonalMessageError] = useState<string>('');

  const isNextDisabled =
    !personalMessage.trim() ||
    !cardLocation.trim() ||
    !cardLocationError ||
    !personalMessageError ||
    !isChecked;

  useEffect(() => {
    const validateFields = () => {
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
    };

    validateFields();
  }, [cardLocation, personalMessage]);

  return (
    <Layout
      footerComponent={
        <Button onClick={() => onNext()} disabled={isNextDisabled}>
          {lang.strings.buttons.next}
        </Button>
      }
    >
      <Container direction="row" gap={4}>
        <Typography $fontSize={20}>
          <LangDisplay text={strings.title} variables={{ name: userName }} />
        </Typography>
        <Tooltip text={strings.tooltip} tooltipPlacement="bottom">
          <QuestionMarkButton />
        </Tooltip>
      </Container>
      <Container direction="column" $flex={1} width="100%">
        <TextAreaInput
          label={strings.form.cardLocationField.label}
          trailing={<Clipboard variant="gold" content={cardLocation} />}
          height={120}
          value={cardLocation}
          tooltip={strings.form.cardLocationField.tooltip}
          placeholder={strings.form.cardLocationField.placeholder}
          error={cardLocationError}
          autoFocus
        />
        <TextAreaInput
          label={strings.form.personalMessageField.label}
          trailing={<Clipboard variant="gold" content={personalMessage} />}
          height={120}
          value={personalMessage}
          tooltip={strings.form.personalMessageField.tooltip}
          placeholder={strings.form.personalMessageField.placeholder}
          error={personalMessageError}
          mb={0}
        />
      </Container>
      <CheckBox
        checked={isChecked}
        id="message_confirmed"
        onChange={() => setIsChecked(!isChecked)}
        label={strings.form.checkBox.label}
      />
    </Layout>
  );
};
