import {
  Button,
  Container,
  Flex,
  LangDisplay,
  OneInMany,
  QuestionMarkButton,
  Tooltip,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectLanguage } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const Nominee = () => {
  const lang = useSelector(selectLanguage);
  const {
    onPrevious,
    onNext,
    nomineeCount,
    setNomineeCount,
    fetchExistingDetailsFromServer,
  } = useInheritanceGoldPlanPurchaseDialog();

  const strings =
    lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor.select;

  useEffect(() => {
    fetchExistingDetailsFromServer();
  }, []);

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => onPrevious()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            onClick={() => onNext()}
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
        <Flex gap={4} align="center">
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.subtitle} />
          </Typography>
          <Tooltip text={strings.tooltip} tooltipPlacement="bottom">
            <QuestionMarkButton />
          </Tooltip>
        </Flex>
      </Container>
      <Container direction="row" gap={8}>
        <OneInMany
          title="1"
          description={strings.options.descOne}
          $styleType="1"
          $width={340}
          isSelected={nomineeCount === 1}
          onClick={() => setNomineeCount(1)}
        />
        <OneInMany
          title="2"
          description={strings.options.descTwo}
          $styleType="1"
          $width={340}
          isSelected={nomineeCount === 2}
          onClick={() => setNomineeCount(2)}
        />
      </Container>
    </Layout>
  );
};
