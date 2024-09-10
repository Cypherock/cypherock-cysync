import {
  Flex,
  Typography,
  LangDisplay,
  InputLabel,
  Button,
  Container,
  Reminder,
  Accordion,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectLanguage } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorReminderSetup = () => {
  const { onNext, onPrevious } = useInheritanceGoldPlanPurchaseDialog();
  const lang = useSelector(selectLanguage);
  const [newReminder, setNewReminder] = useState(1);
  const strings =
    lang.strings.dialogs.inheritanceEditReminderTime.reminderSetup;
  const { form } = strings;

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => onPrevious()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button onClick={() => onNext()} variant="primary">
            <LangDisplay text={lang.strings.buttons.continue} />
          </Button>
        </>
      }
    >
      <Flex gap={0} direction="column" align="center">
        <Typography $fontSize={20} color="white">
          <LangDisplay text={strings.title} />
        </Typography>
      </Flex>
      <Container direction="column" gap={24}>
        <Accordion
          id="Reminder"
          title={strings.reminderInfo.subtitle}
          content={strings.reminderInfo.subtext}
        />
        <Flex direction="column" gap={8} width="100%" $flex={1}>
          <InputLabel>{strings.form.reminderField.label}</InputLabel>
          <Flex justify="space-between" gap={24} width="100%" $flex={1}>
            <Reminder
              date={`${1} ${form.reminderField.month}`}
              disabled={false}
              width="100%"
              isSelected={newReminder === 1}
              onClick={() => setNewReminder(1)}
            />
            <Reminder
              date={`${3} ${form.reminderField.months}`}
              disabled={false}
              width="100%"
              isSelected={newReminder === 3}
              onClick={() => setNewReminder(3)}
            />
            <Reminder
              date={`${6} ${form.reminderField.months}`}
              disabled={false}
              width="100%"
              isSelected={newReminder === 6}
              onClick={() => setNewReminder(6)}
            />
          </Flex>
        </Flex>
      </Container>
    </Layout>
  );
};
