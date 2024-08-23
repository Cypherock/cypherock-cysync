import {
  Button,
  Container,
  Flex,
  InputLabel,
  LangDisplay,
  MessageBox,
  QuestionMarkButton,
  TextAreaInput,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const NomineePrivateMessageInput = () => {
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
        <Flex>
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.nominee.subtitle} />
          </Typography>
          <QuestionMarkButton
            content={strings.nominee.tooltip}
            position="right"
          />
        </Flex>
      </Container>
      <Flex direction="column" gap={16} $flex={1} width="100%">
        <Flex>
          <InputLabel>{strings.nominee.form.locationField.label}</InputLabel>
          <QuestionMarkButton
            content={strings.nominee.form.locationField.tooltip}
            position="right"
          />
        </Flex>
        <TextAreaInput
          placeholder={strings.nominee.form.locationField.placeholder}
          height={120}
        />
        <Flex direction="column" gap={8} $flex={1} width="100%">
          <Flex>
            <InputLabel>
              {strings.nominee.form.personalMessage.label}
            </InputLabel>
            <QuestionMarkButton
              content={strings.nominee.form.personalMessage.tooltip}
              position="right"
            />
          </Flex>
          <TextAreaInput
            placeholder={strings.nominee.form.personalMessage.placeholder}
            height={120}
          />
        </Flex>
        <MessageBox type="warning" text={strings.nominee.messageBox.warning} />
      </Flex>
    </Layout>
  );
};
