import {
  Flex,
  Typography,
  LangDisplay,
  InputLabel,
  TextAreaInput,
  Button,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectLanguage } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorMessage = () => {
  const { goTo } = useInheritanceGoldPlanPurchaseDialog();
  const lang = useSelector(selectLanguage);
  const { form } =
    lang.strings.dialogs.inheritanceEditExecutorMessage.editMessage;
  const [message, setMessage] = useState('');
  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => goTo(5, 3)} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button onClick={() => goTo(5, 3)} variant="primary">
            <LangDisplay text={lang.strings.buttons.saveAndContinue} />
          </Button>
        </>
      }
    >
      <Flex gap={0} direction="column" align="center">
        <Typography $fontSize={20} color="white">
          <LangDisplay text="Add message for the Executor" />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text="Please note that the message to the executor is not encrypted" />
        </Typography>
      </Flex>
      <Flex
        gap={0}
        direction="column"
        align="stretch"
        $flex="1"
        width="100%"
        pt={2}
      >
        <InputLabel $textAlign="left" px={0}>
          <LangDisplay text={form.messageField.label} />
        </InputLabel>
        <TextAreaInput
          placeholder={form.messageField.placeholder}
          value={message}
          onChange={setMessage}
          height={120}
        />
      </Flex>
    </Layout>
  );
};
