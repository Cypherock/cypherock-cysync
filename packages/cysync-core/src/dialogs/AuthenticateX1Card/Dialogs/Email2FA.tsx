import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  CloseButton,
  Flex,
  Divider,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAuthenticateX1CardDialog } from '../context';

export const Email2FA: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useAuthenticateX1CardDialog();
  const { buttons } = lang.strings;

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} p={0} align="stretch">
        <Typography> AuthenticateX1Card </Typography>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button type="submit" variant="primary" disabled={false}>
          <LangDisplay text={buttons.authenticate} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
