import {
  Container,
  Typography,
  LangDisplay,
  Input,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

interface UserDetailsFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formId: string;
  strings: {
    title: string;
    subTitle?: string;
    form: {
      name: string;
      email: string;
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
}) => {
  const lang = useAppSelector(selectLanguage);
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
        {strings.subTitle && (
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.subTitle} />
          </Typography>
        )}
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
          onChange={setName}
          showRequiredStar
          inputLabelProps={{
            $fontSize: 12,
            $letterSpacing: 'unset',
          }}
          disabled={isSubmittingUserDetails}
        />
      </Container>
      <Container direction="row" $width="full" gap={24}>
        <Input
          pasteAllowed
          name="email"
          type="email"
          label={strings.form.email}
          rightLabel={lang.strings.labels.required}
          value={email}
          required
          onChange={setEmail}
          showRequiredStar
          inputLabelProps={{
            $fontSize: 12,
            $letterSpacing: 'unset',
          }}
          disabled={isSubmittingUserDetails}
        />
        <Input
          pasteAllowed
          name="alternateEmail"
          type="email"
          label={strings.form.alternateEmail}
          rightLabel={lang.strings.labels.required}
          value={alternateEmail}
          required
          onChange={setAlternateEmail}
          showRequiredStar
          inputLabelProps={{
            $fontSize: 12,
            $letterSpacing: 'unset',
          }}
          disabled={isSubmittingUserDetails}
        />
      </Container>
    </form>
  );
};
