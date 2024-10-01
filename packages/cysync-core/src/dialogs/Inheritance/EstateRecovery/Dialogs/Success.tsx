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
import ReactPlayer from 'react-player/youtube';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);

  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.confirmation.success;

  const { onClose } = useInheritanceEstateRecoveryDialog();

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
          <LangDisplay text={strings.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.subTitle} />
        </Typography>
      </Container>
      <ReactPlayer
        url={constants.inheritance.silverPlanPurchaseTutorialLink}
        width="720px"
        height="405px"
      />
    </Layout>
  );
};
