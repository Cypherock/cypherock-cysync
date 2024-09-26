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

export const ConfirmNomineeVerification: React.FC<{ index: number }> = ({
  index,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor;
  const { onNomineeDetailsSubmit, isSubmittingNomineeDetails } =
    useInheritanceGoldPlanPurchaseDialog();
  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => {
              onNomineeDetailsSubmit(false, index);
            }}
            isLoading={isSubmittingNomineeDetails}
            variant="secondary"
          >
            <LangDisplay text={lang.strings.buttons.no} />
          </Button>
          <Button
            onClick={() => onNomineeDetailsSubmit(true, index)}
            isLoading={isSubmittingNomineeDetails}
            variant="primary"
          >
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
