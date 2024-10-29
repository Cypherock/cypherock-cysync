import {
  Flex,
  Typography,
  LangDisplay,
  TextAreaInput,
  Button,
  QuestionMarkButton,
  Tooltip,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectLanguage } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorMessage = () => {
  const {
    onPrevious,
    executorMessage,
    setExecutorMessage,
    onExecutorMessageSubmit,
    isSubmittingExecutorDetails,
    isOnSummaryPage,
  } = useInheritanceGoldPlanPurchaseDialog();
  const lang = useSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.message;
  const { form } = strings.executor;
  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => onPrevious()}
            variant="secondary"
            disabled={isSubmittingExecutorDetails || isOnSummaryPage}
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            onClick={onExecutorMessageSubmit}
            variant="primary"
            isLoading={isSubmittingExecutorDetails}
            disabled={executorMessage.length < 1}
          >
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
        <TextAreaInput
          label={form.messageField.label}
          placeholder={form.messageField.placeholder}
          value={executorMessage}
          onChange={setExecutorMessage}
          height={120}
          maxChars={800}
          currentChars={executorMessage.length || 0}
          rightLabel={lang.strings.labels.required}
          showRequiredStar
          autoFocus
        />
      </Flex>
    </Layout>
  );
};
