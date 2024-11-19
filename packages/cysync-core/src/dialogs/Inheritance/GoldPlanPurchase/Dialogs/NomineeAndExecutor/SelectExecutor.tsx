import {
  Container,
  Typography,
  LangDisplay,
  OneInMany,
  Button,
  Flex,
  QuestionMarkButton,
  Tooltip,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const SelectExecutor = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor;
  const { onPrevious, haveExecutor, setHaveExecutor, onExecutorSelected } =
    useInheritanceGoldPlanPurchaseDialog();

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => onPrevious()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button onClick={() => onExecutorSelected()} variant="primary">
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
          <LangDisplay text={strings.executor.select.title} />
        </Typography>
        <Flex gap={4} align="center">
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.executor.select.subtext} />
          </Typography>
          <Tooltip
            text={strings.executor.select.tooltip}
            tooltipPlacement="bottom"
          >
            <QuestionMarkButton />
          </Tooltip>
        </Flex>
      </Container>
      <Container>
        <Container direction="row" gap={8}>
          <OneInMany
            title={strings.executor.select.options.one.yes}
            description={strings.executor.select.options.one.desc}
            $styleType="2"
            $width={340}
            isSelected={haveExecutor}
            onClick={() => setHaveExecutor(true)}
          />
          <OneInMany
            title={strings.executor.select.options.two.no}
            description={strings.executor.select.options.two.desc}
            $styleType="2"
            $width={340}
            isSelected={!haveExecutor}
            onClick={() => setHaveExecutor(false)}
          />
        </Container>
      </Container>
    </Layout>
  );
};
