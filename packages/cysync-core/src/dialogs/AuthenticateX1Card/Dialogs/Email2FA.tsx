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
  Input,
  EmailIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAuthenticateX1CardDialog } from '../context';

export const Email2FA: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, onNext, email, handleEmailChange, error } =
    useAuthenticateX1CardDialog();
  const { buttons, dialogs } = lang.strings;
  const { email2fa } = dialogs.auth;

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} p={0} m={0} align="stretch">
        <Flex
          pt={4}
          pb={{ def: 2, lg: 4 }}
          px={{ def: 3, lg: 5 }}
          gap={{ def: 16, lg: 32 }}
          direction="column"
          align="center"
        >
          <EmailIcon width={56} />
          <Typography color="white" $fontSize={20} $textAlign="center">
            <LangDisplay text={email2fa.title} />
          </Typography>
        </Flex>
        <Flex
          pt={2}
          pb={{ def: 2, lg: 4 }}
          px={{ def: 3, lg: 5 }}
          gap={16}
          direction="column"
          align="stretch"
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              onNext();
            }}
            id="authenticate-x1-card-email-2fa-form"
          >
            <Input
              pasteAllowed
              name="email"
              type="email"
              placeholder={email2fa.emailInput}
              label={email2fa.emailInput}
              value={email}
              required
              onChange={handleEmailChange}
            />
          </form>
          {error && (
            <Typography py={3} color="error" $fontSize={16} $textAlign="left">
              <LangDisplay text={error} />
            </Typography>
          )}
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" disabled={false}>
          <LangDisplay text={buttons.skip} />
        </Button>
        <Button
          form="authenticate-x1-card-email-2fa-form"
          type="submit"
          variant="primary"
          disabled={Boolean(error) || email.length === 0}
        >
          <LangDisplay text={buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
