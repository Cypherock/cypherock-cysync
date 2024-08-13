import {
  Container,
  Typography,
  LangDisplay,
  MessageBox,
  Button,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ConfirmNomineeVerification = () => {
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
          <Button onClick={() => goTo(5, 3)} variant="primary">
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
          <LangDisplay text={strings.nomineeDetails.confirm.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.nomineeDetails.confirm.subtext} />
        </Typography>
      </Container>
      <Container>
        <MessageBox
          text={strings.nomineeDetails.confirm.warning}
          type="warning"
        />
      </Container>
    </Layout>
  );
};
