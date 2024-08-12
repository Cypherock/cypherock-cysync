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
  const { goTo } = useInheritanceGoldPlanPurchaseDialog();
  const lang = useSelector(selectLanguage);

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => goTo(5, 3)} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button onClick={() => goTo(5, 3)} variant="primary">
            <LangDisplay text="Save and Continue" />
          </Button>
        </>
      }
    >
      <Flex gap={0} direction="column" align="center">
        <Typography $fontSize={20} color="white">
          <LangDisplay text="Reminder setup" />
        </Typography>
      </Flex>
      <Container direction="column" gap={24}>
        <Accordion
          id="Reminder"
          title="What is Reminder time"
          content={
            "Reminder Time is the interval at which you'll receive a confirmation email from Cypherock to verify your continued well-being. If no response is received within one month of the initial email, the estate recovery will commence and your nominee will receive the recovery instructions from Cypherock"
          }
        />
        <Container direction="column" gap={8}>
          <InputLabel>Set reminder time interval</InputLabel>
          <Container direction="row" gap={24}>
            <Reminder date="1 Month" disabled={false} />
            <Reminder date="3 Months" disabled={false} />
            <Reminder date="6 Months" disabled={false} />
          </Container>
        </Container>
      </Container>
    </Layout>
  );
};
