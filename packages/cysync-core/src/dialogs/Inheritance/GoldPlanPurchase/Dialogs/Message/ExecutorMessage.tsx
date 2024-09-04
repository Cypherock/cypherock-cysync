import {
  Flex,
  Typography,
  LangDisplay,
  InputLabel,
  TextAreaInput,
  Button,
  QuestionMarkButton,
  Tooltip,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectLanguage } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorMessage = () => {
  const { goTo, onNext } = useInheritanceGoldPlanPurchaseDialog();
  const lang = useSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.message;
  const { form } = strings.executor;
  const [message, setMessage] = useState('');
  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => goTo(6, 1)} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button onClick={() => onNext()} variant="primary">
            <LangDisplay text={lang.strings.buttons.saveAndContinue} />
          </Button>
        </>
      }
    >
      <Flex gap={0} direction="column" align="center">
        <Typography $fontSize={20} color="white">
          <LangDisplay text={strings.executor.title} />
        </Typography>
        <Flex gap={4} align="center">
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.executor.subtitle} />
          </Typography>
          <Tooltip text={strings.executor.tooltip} tooltipPlacement="bottom">
            <QuestionMarkButton />
          </Tooltip>
        </Flex>
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
