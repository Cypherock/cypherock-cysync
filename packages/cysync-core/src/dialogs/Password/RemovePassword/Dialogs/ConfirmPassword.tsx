import {
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Divider,
  Flex,
  LangDisplay,
  PasswordInput,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useRemovePasswordDialog } from '../context';

export const ConfirmPassword: React.FC = () => {
  const {
    onClose,
    handleRemovePassword,
    isLoading,
    isSubmitDisabled,
    error,
    password,
    handlePasswordChange,
  } = useRemovePasswordDialog();
  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { input } = dialogs.password;
  const { confimPassword } = dialogs.password;

  return (
    <DialogBox width={500} align="stretch" gap={0} onClose={onClose}>
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
        <Flex gap={24} px={5} pt={2} pb={4} direction="column" align="stretch">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleRemovePassword();
            }}
            id="remove-password-confirm-form"
          >
            <Flex gap={16} direction="column" align="stretch">
              <PasswordInput
                pasteAllowed
                name="password"
                placeholder={input.enterPassword}
                label={input.enterPassword}
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
              <Divider variant="horizontal" />
            </Flex>
          </form>
          {error && (
            <Typography $fontSize={16} pb={4} color="error">
              {error}
            </Typography>
          )}
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          form="remove-password-confirm-form"
          type="submit"
          variant="danger"
          disabled={isSubmitDisabled}
          isLoading={isLoading}
        >
          <LangDisplay text={buttons.removePassword} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
