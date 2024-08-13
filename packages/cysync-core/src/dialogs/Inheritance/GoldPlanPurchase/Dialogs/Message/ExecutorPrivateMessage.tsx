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

  const strings = lang.strings.inheritanceGoldPlanPurchase.message;

  const { goTo } = useInheritanceGoldPlanPurchaseDialog();

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => goTo(6, 0)} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button onClick={() => goTo(6, 2)} variant="primary">
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
          <LangDisplay text={strings.nominee.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.nominee.subtitle} />
        </Typography>
      </Container>
      <Flex direction="column" gap={16} $flex={1} width="100%">
        <TextAreaInput
          placeholder={strings.nominee.form.locationPlaceholder}
          height={120}
        />
        <Flex direction="column" gap={8} $flex={1} width="100%">
          <InputLabel>{strings.nominee.form.personalMessage.label}</InputLabel>
          <TextAreaInput
            placeholder={strings.nominee.form.personalMessage.placeholder}
            height={120}
          />
        </Flex>
        <MessageBox type="warning" text={strings.nominee.warning} />
      </Flex>
    </Layout>
  );
};
