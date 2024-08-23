import {
  Container,
  Typography,
  LangDisplay,
  OneInMany,
  Button,
  Flex,
  QuestionMarkButton,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const SelectExecutor = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor;
  const { goTo, onNext } = useInheritanceGoldPlanPurchaseDialog();
  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => goTo(5, 3)} variant="secondary">
            <LangDisplay text={lang.strings.buttons.no} />
          </Button>
          <Button onClick={() => onNext()} variant="primary">
            <LangDisplay text={lang.strings.buttons.yes} />
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
          <LangDisplay text={strings.executor.select.title} />
        </Typography>
        <Flex gap={4}>
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.executor.select.subtext} />
          </Typography>
          <QuestionMarkButton
            content={strings.executor.select.tooltip}
            position="right"
          />
        </Flex>
      </Container>
      <Container>
        <Container direction="row" gap={8}>
          <OneInMany
            title={strings.executor.select.options.one.yes}
            description={strings.executor.select.options.one.desc}
            styleType="2"
            $width={340}
          />
          <OneInMany
            title={strings.executor.select.options.two.no}
            description={strings.executor.select.options.two.desc}
            styleType="2"
            $width={340}
          />
        </Container>
      </Container>
    </Layout>
  );
};
