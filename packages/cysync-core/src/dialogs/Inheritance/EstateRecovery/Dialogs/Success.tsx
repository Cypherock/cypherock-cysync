import { constants } from '@cypherock/cysync-core-constants';
import {
  Button,
  Container,
  Image,
  LangDisplay,
  successIcon,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { VideoPlayer } from '~/components/VideoPlayer';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);

  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.confirmation.success;

  const { onClose, onRetry, retryIndex } = useInheritanceEstateRecoveryDialog();
  const ownerName = 'Wallet Owner';

  return (
    <Layout
      footerComponent={
        <Button onClick={() => onClose()}>
          <LangDisplay text={lang.strings.buttons.done} />
        </Button>
      }
    >
      <Container direction="column">
        <Image src={successIcon} alt="Success Icon" mb={4} />
        <Typography
          variant="h5"
          color="heading"
          $textAlign="center"
          $fontSize={20}
        >
          <LangDisplay text={strings.title} variables={{ name: ownerName }} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.subTitle} />
        </Typography>
      </Container>
      <VideoPlayer
        key={retryIndex}
        url={constants.inheritance.estateRecoverySuccessVideo}
        width="720px"
        height="405px"
        onRetry={onRetry}
      />
    </Layout>
  );
};
