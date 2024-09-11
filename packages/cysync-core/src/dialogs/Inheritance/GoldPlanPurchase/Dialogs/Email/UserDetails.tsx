import {
  Button,
  Container,
  Input,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const UserDetails = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritance.dialog.userDetails;
  const goldPlanStrings =
    lang.strings.inheritanceGoldPlanPurchase.email.userDetails;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');

  const {
    registerUser,
    onPrevious,
    onNext,
    isRegisteringUser,
    walletAuthStep,
  } = useInheritanceGoldPlanPurchaseDialog();

  const formId = 'inheritance-gold-plan-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRegisteringUser) return;

    registerUser({
      name,
      email,
      alternateEmail,
    });
  };

  useEffect(() => {
    if (walletAuthStep > WalletAuthLoginStep.userDetails) {
      onNext();
    }
  }, []);

  const isSameEmail = Boolean(email && email === alternateEmail);

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => onPrevious()}
            variant="secondary"
            disabled={isRegisteringUser}
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            variant="primary"
            type="submit"
            form={formId}
            disabled={isRegisteringUser || isSameEmail}
            isLoading={isRegisteringUser}
          >
            <LangDisplay text={goldPlanStrings.buttons.sendOTP} />
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
            <LangDisplay text={goldPlanStrings.title} />
          </Typography>
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={goldPlanStrings.title} />
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
            disabled={isRegisteringUser}
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
            disabled={isRegisteringUser}
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
            disabled={isRegisteringUser}
          />
        </Container>
        {isSameEmail && (
          <Typography $fontSize={16} pt={2} color="error">
            {strings.error.sameEmail}
          </Typography>
        )}
      </form>
    </Layout>
  );
};
