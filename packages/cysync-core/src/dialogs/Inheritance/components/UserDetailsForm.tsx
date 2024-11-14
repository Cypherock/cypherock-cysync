import { constants } from '@cypherock/cysync-core-constants';
import {
  Container,
  Typography,
  LangDisplay,
  Input,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { selectLanguage, useAppSelector } from '~/store';
import { getEmailValidationSchema } from '~/utils';

interface UserDetailsFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formId: string;
  strings: {
    title: string;
    subTitle?: string;
    form: {
      name: string;
      emailField: {
        label: string;
        tooltip?: string;
      };
      alternateEmail: string;
    };
  };
  name: string;
  setName: (name: string) => void;
  isSubmittingUserDetails: boolean;
  email: string;
  setEmail: (email: string) => void;
  alternateEmail: string;
  setAlternateEmail: (altEmail: string) => void;
  isAlternateEmailRequired?: boolean;
  isSameEmail?: boolean;
  setHasErrors?: (val: boolean) => void;
}

export const UserDetailsForm: FC<UserDetailsFormProps> = ({
  onSubmit,
  formId,
  strings,
  name,
  setName,
  isSubmittingUserDetails,
  email,
  setEmail,
  alternateEmail,
  setAlternateEmail,
  isAlternateEmailRequired,
  isSameEmail,
  setHasErrors,
}) => {
  const lang = useAppSelector(selectLanguage);
  const userDetailsStrings = lang.strings.inheritance.dialog.userDetails;
  const [emailValidationError, setEmailValidationError] = useState('');

  const schema = z.object({
    email: getEmailValidationSchema(lang),
    alternateEmail: getEmailValidationSchema(lang, isAlternateEmailRequired),
  });

  const [errorKey, setErrorKey] = useState<string>('');

  const errorText = useMemo(() => {
    if (emailValidationError) return emailValidationError;
    if (isSameEmail) return userDetailsStrings.error.sameEmail;
    return '';
  }, [isSameEmail, emailValidationError]);

  useEffect(() => {
    setHasErrors?.(false);
    if (!email && !alternateEmail) return;
    const validation = schema.safeParse({ email, alternateEmail });
    setErrorKey('');
    setEmailValidationError('');

    if (!validation.success) {
      const key = Object.keys(validation.error.formErrors.fieldErrors)[0];
      const error = (validation.error.formErrors.fieldErrors as any)[key][0];
      setErrorKey(key);
      setEmailValidationError(error);
      setHasErrors?.(true);
    }
  }, [email, alternateEmail]);

  return (
    <form style={{ width: '100%' }} onSubmit={onSubmit} id={formId}>
      <Container direction="column" $width="full" mb={4}>
        <Typography
          variant="h5"
          color="heading"
          $textAlign="center"
          $fontSize={20}
          mb="4px"
        >
          <LangDisplay text={strings.title} />
        </Typography>
      </Container>
      <Container direction="column" $width="full" mb={3}>
        <Input
          pasteAllowed
          name="name"
          type="text"
          label={strings.form.name}
          rightLabel={lang.strings.labels.required}
          value={name}
          required
          autoFocus
          onChange={setName}
          showRequiredStar
          inputLabelProps={{
            $fontSize: 12,
            $letterSpacing: 'unset',
          }}
          disabled={isSubmittingUserDetails}
          maxLength={constants.inheritance.maxUserDetailsInputLength}
        />
      </Container>
      <Container direction="row" $width="full" gap={24}>
        <Input
          pasteAllowed
          name="email"
          type="email"
          label={strings.form.emailField.label}
          rightLabel={lang.strings.labels.required}
          value={email}
          tooltip={strings.form.emailField.tooltip}
          required
          onChange={setEmail}
          showRequiredStar
          inputLabelProps={{
            $fontSize: 12,
            $letterSpacing: 'unset',
          }}
          disabled={isSubmittingUserDetails}
          maxLength={constants.inheritance.maxUserDetailsInputLength}
          $error={errorKey === 'email'}
        />
        <Input
          pasteAllowed
          name="alternateEmail"
          type="email"
          label={strings.form.alternateEmail}
          rightLabel={
            isAlternateEmailRequired === false
              ? undefined
              : lang.strings.labels.required
          }
          value={alternateEmail}
          required={isAlternateEmailRequired ?? true}
          onChange={setAlternateEmail}
          showRequiredStar={isAlternateEmailRequired ?? true}
          inputLabelProps={{
            $fontSize: 12,
            $letterSpacing: 'unset',
          }}
          disabled={isSubmittingUserDetails}
          maxLength={constants.inheritance.maxUserDetailsInputLength}
          $error={errorKey === 'alternateEmail'}
        />
      </Container>
      {errorText && (
        <Typography $fontSize={16} pt={2} color="error">
          {errorText}
        </Typography>
      )}
    </form>
  );
};

UserDetailsForm.defaultProps = {
  isAlternateEmailRequired: undefined,
  isSameEmail: undefined,
  setHasErrors: undefined,
};
