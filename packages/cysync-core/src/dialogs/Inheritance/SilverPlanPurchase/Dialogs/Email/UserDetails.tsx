import {
  Button,
  Container,
  Input,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const UserDetails = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritance.dialog.userDetails;
  const silverPlanStrings =
    lang.strings.inheritanceSilverPlanPurchase.email.userDetails;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');

  const { onUserDetailsSubmit, onPrevious, isSubmittingUserDetails } =
    useInheritanceSilverPlanPurchaseDialog();

  const formId = 'inheritance-silver-plan-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmittingUserDetails) return;

    onUserDetailsSubmit({
      name,
      email,
      alternateEmail,
    });
  };

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => onPrevious()}
            variant="secondary"
            disabled={isSubmittingUserDetails}
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            variant="primary"
            type="submit"
            form={formId}
            disabled={isSubmittingUserDetails}
            isLoading={isSubmittingUserDetails}
          >
            <LangDisplay text={silverPlanStrings.buttons.sendOTP} />
          </Button>
        </>
      }
    >
      <form style={{ width: '100%' }} onSubmit={onSubmit} id={formId}>
        <Container direction="column" $width="full" mb={4}>
          <Typography
            variant="h5"
            color="heading"
            $textAlign="center"
            $fontSize={20}
            mb="4px"
          >
            <LangDisplay text={silverPlanStrings.title} />
          </Typography>
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={silverPlanStrings.subTitle} />
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
    </Layout>
  );
};
