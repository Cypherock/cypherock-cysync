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
import React from 'react';
import { useSelector } from 'react-redux';

import { selectLanguage } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorReminderSetup = () => {
  const {
    onPrevious,
    reminderPeriod,
    setReminderPeriod,
    isSubmittingReminderDetails,
    onReminderDetailsSubmit,
    isOnSummaryPage,
  } = useInheritanceGoldPlanPurchaseDialog();
  const lang = useSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEditReminderTime.reminderSetup;
  const { form } = strings;

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => onPrevious()}
            variant="secondary"
            disabled={isSubmittingReminderDetails || isOnSummaryPage}
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            onClick={onReminderDetailsSubmit}
            variant="primary"
            isLoading={isSubmittingReminderDetails}
          >
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
              isSelected={reminderPeriod === 'monthly'}
              onClick={() => setReminderPeriod('monthly')}
            />
            <Reminder
              date={`${3} ${form.reminderField.months}`}
              disabled={false}
              width="100%"
              isSelected={reminderPeriod === 'quarterly'}
              onClick={() => setReminderPeriod('quarterly')}
            />
            <Reminder
              date={`${6} ${form.reminderField.months}`}
              disabled={false}
              width="100%"
              isSelected={reminderPeriod === 'half-yearly'}
              onClick={() => setReminderPeriod('half-yearly')}
            />
          </Flex>
        </Flex>
      </Container>
    </Layout>
  );
};
