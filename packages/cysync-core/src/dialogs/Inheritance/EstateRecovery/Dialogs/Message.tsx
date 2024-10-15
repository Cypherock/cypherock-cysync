import {
  Button,
  CheckBox,
  Clipboard,
  Container,
  LangDisplay,
  TextAreaInput,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const Message = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, decryptedCardLocation, decryptedPersonalMessage } =
    useInheritanceEstateRecoveryDialog();
  const [isChecked, setIsChecked] = useState(false);
  const strings = lang.strings.dialogs.inheritanceEstateRecovery.viewMessage;

  const userName = 'Alfred Ballows';
  const cardLocation = decryptedCardLocation ?? '';
  const personalMessage = decryptedPersonalMessage ?? '';

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
      <Container direction="column" $flex={1} width="100%">
        <TextAreaInput
          label={strings.form.cardLocationField.label}
          trailing={<Clipboard variant="gold" content={cardLocation} />}
          height={120}
          value={cardLocation}
          placeholder={strings.form.cardLocationField.placeholder}
        />
        <TextAreaInput
          label={strings.form.personalMessageField.label}
          trailing={<Clipboard variant="gold" content={personalMessage} />}
          height={120}
          value={personalMessage}
          placeholder={strings.form.personalMessageField.placeholder}
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
