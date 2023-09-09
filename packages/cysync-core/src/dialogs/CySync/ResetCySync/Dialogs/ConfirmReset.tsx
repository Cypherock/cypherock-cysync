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
  ExclamationTriangle,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useResetCySyncDialog } from '../context';

export const ConfirmReset: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useResetCySyncDialog();
  const { buttons, dialogs } = lang.strings;
  const { confim } = dialogs.cysync.reset;

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody
        gap={{ def: 16, lg: 32 }}
        px={{ def: 3, lg: 5 }}
        pt={{ def: 4, lg: 4 }}
        pb={{ def: 2, lg: 4 }}
        align="center"
      >
        <ExclamationTriangle width={56} />
        <Flex direction="column" align="stretch" gap={4}>
          <Typography color="white" $fontSize={20} $textAlign="center">
            <LangDisplay text={confim.title} />
          </Typography>
          <Typography color="muted" $fontSize={16} $textAlign="center">
            <LangDisplay text={confim.subTitle} />
          </Typography>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" disabled={false} onClick={onClose}>
          <LangDisplay text={buttons.cancel} />
        </Button>
        <Button variant="primary" disabled={false} onClick={onClose}>
          <LangDisplay text={buttons.reset} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
