import {
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Typography,
  DialogBoxHeader,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useSignMessageDialog } from '../context';

export const ViewSigningStateDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { signMessage } = lang.strings;
  const { dapp } = useSignMessageDialog();

  return (
    <DialogBox width={500}>
      <DialogBoxHeader py={2}>
        <span style={{ height: '24px', width: '100%' }} />
      </DialogBoxHeader>
      <DialogBoxBody pt={0} pr={0} pb={0} pl={0}>
        <Container display="flex" direction="column" py={4} px={5}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={signMessage.title} />
          </Typography>
          <Typography variant="span" color="muted">
            <LangDisplay text={dapp.url} />
          </Typography>
        </Container>
        <Container
          display="flex"
          direction="column"
          gap={24}
          pt={2}
          pb={4}
          px={5}
        >
          <Typography>Signing Message...</Typography>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
