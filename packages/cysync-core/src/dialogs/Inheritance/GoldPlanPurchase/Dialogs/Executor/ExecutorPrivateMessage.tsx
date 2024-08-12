import {
  Button,
  Container,
  Flex,
  InputLabel,
  LangDisplay,
  MessageBox,
  TextAreaInput,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorPrivateMessageInput = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceGoldPlanPurchase.nominee;

  const { onNext, onPrevious } = useInheritanceGoldPlanPurchaseDialog();

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
      <Container direction="column" gap={4}>
        <Typography
          variant="h5"
          color="heading"
          $textAlign="center"
          $fontSize={20}
        >
          <LangDisplay text={strings.executor.nomineeMessage.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.executor.nomineeMessage.subtitle} />
        </Typography>
      </Container>
      <Container direction="column" gap={16}>
        <TextAreaInput
          placeholder={strings.executor.nomineeMessage.form.locationPlaceholder}
          height={120}
        />
        <Flex direction="column" gap={8}>
          <InputLabel>
            {strings.executor.nomineeMessage.form.personalMessage.label}
          </InputLabel>
          <TextAreaInput
            placeholder={
              strings.executor.nomineeMessage.form.personalMessage.placeholder
            }
            height={120}
          />
        </Flex>
        <MessageBox
          type="warning"
          text={strings.executor.nomineeMessage.warning}
        />
      </Container>
    </Layout>
  );
};
