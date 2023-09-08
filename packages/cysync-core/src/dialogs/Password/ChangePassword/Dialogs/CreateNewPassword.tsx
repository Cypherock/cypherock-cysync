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

import { useChangePasswordDialog } from '../context';

export const CreateNewPassword: React.FC = () => {
  const {
    onClose,
    oldPassword,
    newPassword,
    confirmNewPassword,
    error,
    handleOldPasswordChange,
    handleNewPasswordChange,
    handleConfirmNewPasswordChange,
  } = useChangePasswordDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { createNewPassword } = dialogs.changePassword;

  return (
    <DialogBox width={500} align="stretch" gap={0}>
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
              onClose();
            }}
            id="change-password-create-new-form"
          >
            <Flex gap={16} direction="column" align="stretch">
              <PasswordInput
                pasteAllowed
                name="password"
                placeholder={createNewPassword.oldPassword}
                label={createNewPassword.oldPassword}
                value={oldPassword}
                onChange={handleOldPasswordChange}
              />
              <PasswordInput
                pasteAllowed
                name="password"
                placeholder={createNewPassword.newPassword}
                label={createNewPassword.newPassword}
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <PasswordInput
                pasteAllowed
                name="password"
                placeholder={createNewPassword.confirmPassword}
                label={createNewPassword.confirmPassword}
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
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
            <LangDisplay text={createNewPassword.info} />
          </Typography>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          type="submit"
          variant="secondary"
          disabled={false}
          onClick={e => {
            e.preventDefault();
            onClose();
          }}
        >
          <LangDisplay text={buttons.cancel} />
        </Button>
        <Button
          form="change-password-create-new-form"
          type="submit"
          variant="primary"
          disabled={
            Boolean(error) ||
            oldPassword.length === 0 ||
            newPassword.length < 8 ||
            confirmNewPassword.length < 8 ||
            newPassword !== confirmNewPassword
          }
        >
          <LangDisplay text={buttons.confirm} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
