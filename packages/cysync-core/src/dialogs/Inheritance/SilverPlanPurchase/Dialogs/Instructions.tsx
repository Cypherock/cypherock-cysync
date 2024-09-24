import { constants } from '@cypherock/cysync-core-constants';
import {
  Button,
  Container,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';
import { CustomReactPlayer } from '~/components/CustomReactPlayer';

export const Instructions = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceSilverPlanPurchase;

  const { onNext, onPrevious } = useInheritanceSilverPlanPurchaseDialog();

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => onPrevious()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button onClick={() => onNext()} variant="primary">
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
          <LangDisplay text={strings.instructions.video.title} />
        </Typography>
      </Container>
      <CustomReactPlayer
        url={constants.inheritance.silverPlanPurchaseTutorialLink}
      />
    </Layout>
  );
};
