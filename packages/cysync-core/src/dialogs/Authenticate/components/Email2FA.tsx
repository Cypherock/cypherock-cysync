import {
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Divider,
  EmailIcon,
  Flex,
  Input,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore, validateEmail } from '~/utils';

interface Email2FAProps {
  onClose: () => void;
  onNext: () => void;
}

export const Email2FA: React.FC<Email2FAProps> = ({ onClose, onNext }) => {
  const lang = useAppSelector(selectLanguage);
  const { buttons, dialogs } = lang.strings;
  const { email2fa } = dialogs.auth;
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const validateInputEmail = () => {
    if (email == null || email.length === 0) {
      setError(null);
      return;
    }

    const validation = validateEmail(email, lang);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setError(null);
  };
  useEffect(validateInputEmail, [email]);

  const validateForm = () => {
    const isSubmitDisabledNew =
      Boolean(error) || email === null || email.length === 0 || isLoading;

    setIsSubmitDisabled(isSubmitDisabledNew);
  };
  useEffect(validateForm, [email, isLoading, error]);

  useEffect(() => {
    keyValueStore.email.get().then(setEmail);
  }, []);

  const handleSkip = async () => {
    setIsLoading(true);
    await keyValueStore.email.remove();
    setIsLoading(false);
    onNext();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (email === null || email.length === 0) {
      await keyValueStore.email.remove();
    } else {
      await keyValueStore.email.set(email);
    }
    setIsLoading(false);
    onNext();
  };

  return (
    <DialogBox width={500} align="stretch" gap={0} onClose={onClose}>
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
              handleSubmit();
            }}
            id="authenticate-x1-card-email-2fa-form"
          >
            <Input
              pasteAllowed
              name="email"
              type="email"
              placeholder={email2fa.emailInput}
              label={email2fa.emailInput}
              value={email ?? ''}
              required
              onChange={setEmail}
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
        <Button variant="secondary" disabled={isLoading} onClick={handleSkip}>
          <LangDisplay text={buttons.skip} />
        </Button>
        <Button
          form="authenticate-x1-card-email-2fa-form"
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}
        >
          <LangDisplay text={buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
