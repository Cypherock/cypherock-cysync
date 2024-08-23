import {
  Button,
  Container,
  Flex,
  LangDisplay,
  OneInMany,
  QuestionMarkButton,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectLanguage } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const Nominee = () => {
  const lang = useSelector(selectLanguage);
  const { onPrevious, goTo, nomineeCount } =
    useInheritanceGoldPlanPurchaseDialog();
  const strings =
    lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor.select;

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => onPrevious()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            onClick={() => goTo(5, 1)}
            variant="primary"
            disabled={!nomineeCount}
          >
            <LangDisplay text={lang.strings.buttons.next} />
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
          <LangDisplay text={strings.title} />
        </Typography>
        <Flex gap={4}>
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.subtitle} />
          </Typography>
          <QuestionMarkButton content={strings.tooltip} position="right" />
        </Flex>
      </Container>
      <Container direction="row" gap={8}>
        <OneInMany
          title="1"
          description={strings.options.descOne}
          styleType="1"
          $width={340}
        />
        <OneInMany
          title="2"
          description={strings.options.descTwo}
          styleType="1"
          $width={340}
        />
      </Container>
    </Layout>
  );
};
