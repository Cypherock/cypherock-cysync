import { constants } from '@cypherock/cysync-core-constants';
import {
  Button,
  Container,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { VideoPlayer } from '~/components/VideoPlayer';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorMessageTutorial = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.message;

  const { onNext, onPrevious, onRetry, retryIndex } =
    useInheritanceGoldPlanPurchaseDialog();

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
          <LangDisplay text={strings.tutorial.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.tutorial.subtext} />
        </Typography>
      </Container>

      <VideoPlayer
        key={retryIndex}
        url={constants.inheritance.goldPlanMessageTutorialVideo}
        width="720px"
        height="405px"
        onRetry={onRetry}
      />
    </Layout>
  );
};
