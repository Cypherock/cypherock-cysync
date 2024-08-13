import {
  Container,
  Typography,
  LangDisplay,
  OneInMany,
  Button,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const SelectExecutor = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor;
  const { goTo } = useInheritanceGoldPlanPurchaseDialog();
  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => goTo(5, 3)} variant="secondary">
            <LangDisplay text={lang.strings.buttons.yes} />
          </Button>
          <Button onClick={() => goTo(5, 5)} variant="primary">
            <LangDisplay text={lang.strings.buttons.no} />
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
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.executor.select.subtext} />
        </Typography>
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
