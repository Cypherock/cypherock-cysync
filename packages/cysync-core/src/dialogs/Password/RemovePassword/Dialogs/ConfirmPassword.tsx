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
  PasswordInput,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useRemovePasswordDialog } from '../context';

export const ConfirmPassword: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { onClose } = useRemovePasswordDialog();
  const { buttons, dialogs } = strings;
  const { confimPassword } = dialogs.removePassword;

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} p={0} align="stretch">
        <Flex px={5} py={4} gap={4} direction="column" align="center">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={confimPassword.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={confimPassword.subTitle} />
          </Typography>
        </Flex>
        <Flex gap={16} px={5} pt={2} pb={4} direction="column" align="stretch">
          <form
            onSubmit={e => {
              e.preventDefault();
              onClose();
            }}
            id="remove-password-confirm-form"
          >
            <PasswordInput
              pasteAllowed
              name="password"
              placeholder={confimPassword.label}
              label={confimPassword.label}
            />
          </form>
          <Divider variant="horizontal" />
          <Typography pt={3} pb={4} $fontSize={16} color="error">
            Password mismatch and other error messages
          </Typography>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          form="remove-password-confirm-form"
          type="submit"
          variant="primary"
          disabled={false}
        >
          <LangDisplay text={buttons.removePassword} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
