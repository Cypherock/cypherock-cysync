import {
  Button,
  Container,
  MessageBox,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const Note = () => {
  const lang = useAppSelector(selectLanguage);

  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.confirmation.importantNote;

  const { onNext, onPrevious } = useInheritanceEstateRecoveryDialog();

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => {
              onPrevious();
            }}
          >
            {lang.strings.buttons.back}
          </Button>
          <Button
            onClick={() => {
              onNext();
            }}
          >
            {lang.strings.buttons.next}
          </Button>
        </>
      }
    >
      <Container direction="column" mb={2}>
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted">
          {strings.subTitle}
        </Typography>
      </Container>
      <Container direction="column" gap={8}>
        <MessageBox
          type="warning"
          text={strings.messageBox.warnings.settings}
        />
        <MessageBox
          type="warning"
          text={strings.messageBox.warnings.deletePermanently}
        />
      </Container>
    </Layout>
  );
};
