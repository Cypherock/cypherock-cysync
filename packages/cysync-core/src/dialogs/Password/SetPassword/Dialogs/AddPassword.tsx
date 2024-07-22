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

import { useSetPasswordDialog } from '../context';

export const AddPassword: React.FC = () => {
  const {
    onClose,
    error,
    newPassword,
    confirmNewPassword,
    handleNewPasswordChange,
    handleConfirmNewPasswordChange,
    handleSetPassword,
    isLoading,
    isSubmitDisabled,
  } = useSetPasswordDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { input } = dialogs.password;
  const { createNewPassword, info } = dialogs.password;

  return (
    <DialogBox width={500} align="stretch" gap={0} onClose={onClose}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} p={0} align="stretch">
        <Flex px={5} py={4} gap={4} direction="column" align="center">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={createNewPassword.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={createNewPassword.subTitle} />
          </Typography>
        </Flex>
        <Flex gap={24} px={5} pt={2} pb={4} direction="column" align="stretch">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSetPassword();
            }}
            id="set-password-create-new-form"
          >
            <Flex gap={16} direction="column" align="stretch">
              <PasswordInput
                pasteAllowed
                name="password"
                placeholder={input.newPassword}
                label={input.newPassword}
                value={newPassword}
                onChange={handleNewPasswordChange}
                disabled={isLoading}
              />
              <PasswordInput
                pasteAllowed
                name="password"
                placeholder={input.confirmPassword}
                label={input.confirmPassword}
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
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
          <Typography $textAlign="center" $fontSize={14} color="muted">
            <LangDisplay text={info.constraints} />
          </Typography>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={e => {
            e.preventDefault();
            onClose();
          }}
        >
          <LangDisplay text={buttons.cancel} />
        </Button>
        <Button
          form="set-password-create-new-form"
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}
          isLoading={isLoading}
        >
          <LangDisplay text={buttons.confirm} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
