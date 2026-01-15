import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Input,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';
import { z } from 'zod';

import { selectLanguage, useAppSelector } from '~/store';
import { getEmailValidationSchema } from '~/utils';

import { useCantonLoginDialog } from '../context';

export const UserDetails = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.cantonSignup.userDetails;
  const [emailValidationError, setEmailValidationError] = useState('');
  const [errorKey, setErrorKey] = useState<string>('');

  const schema = z.object({
    email: getEmailValidationSchema(lang),
  });

  const {
    onUserDetailsSubmit,
    isSubmittingUserDetails,
    email,
    setEmail,
    setHasErrors,
    onClose,
  } = useCantonLoginDialog();

  const handleEmailChange = (val: string) => {
    setHasErrors(false);
    setErrorKey('');
    setEmailValidationError('');
    setEmail(val);
    if (!val) return;
    const validation = schema.safeParse({ email: val });
    if (!validation.success) {
      const key = Object.keys(validation.error.formErrors.fieldErrors)[0];
      const error = (validation.error.formErrors.fieldErrors as any)[key][0];
      setErrorKey(key);
      setEmailValidationError(error);
      setHasErrors(true);
    }
  };

  const errorText = useMemo(() => {
    if (emailValidationError) return emailValidationError;
    return '';
  }, [emailValidationError]);

  return (
    <DialogBox width="800px">
      <DialogBoxBody>
        <Flex direction="column" align="center" justify="center" $width="100%">
          <Typography $fontSize={20} $textAlign="center" color="white" mb="4px">
            {strings.title}
          </Typography>
          <Typography $fontSize={16} $textAlign="center" color="muted" mb={4}>
            {strings.subtext}
          </Typography>
          <Input
            pasteAllowed
            name="email"
            type="email"
            label={strings.emailField.label}
            rightLabel={lang.strings.labels.required}
            value={email}
            onChange={handleEmailChange}
            required
            showRequiredStar
            autoFocus
            disabled={isSubmittingUserDetails}
            $error={errorKey === 'email'}
          />
        </Flex>
        {errorText && (
          <Typography $fontSize={16} pt={2} color="error">
            {errorText}
          </Typography>
        )}
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button onClick={() => onClose()} variant="secondary">
          <LangDisplay text={lang.strings.buttons.back} />
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmittingUserDetails || !email || errorKey === 'email'}
          onClick={onUserDetailsSubmit}
        >
          <LangDisplay text={strings.sendOTPButton} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
