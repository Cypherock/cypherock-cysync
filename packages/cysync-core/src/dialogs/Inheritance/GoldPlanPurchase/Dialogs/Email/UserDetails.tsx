import { Button, LangDisplay } from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { UserDetailsForm } from '../../components';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const UserDetails = () => {
  const lang = useAppSelector(selectLanguage);

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
            isLoading={isRegisteringUser}
          >
            <LangDisplay text={goldPlanStrings.buttons.sendOTP} />
          </Button>
        </>
      }
    >
      <UserDetailsForm
        onSubmit={onSubmit}
        formId={formId}
        strings={goldPlanStrings}
        name={name}
        setName={setName}
        isSubmittingUserDetails={isRegisteringUser}
        email={email}
        setEmail={setEmail}
        alternateEmail={alternateEmail}
        setAlternateEmail={setAlternateEmail}
      />
    </Layout>
  );
};
