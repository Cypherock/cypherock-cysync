import { Button, LangDisplay } from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { UserDetailsForm } from '../../../components';

import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';
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

  const {
    registerUser,
    onPrevious,
    onNext,
    isRegisteringUser,
    walletAuthStep,
  } = useInheritanceSilverPlanPurchaseDialog();

  const formId = 'inheritance-silver-plan-user-details';

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

  const [hasErrors, setHasErrors] = useState(false);
  const isFormIncomplete = useMemo(
    () => !name || !email || !alternateEmail || hasErrors,
    [hasErrors],
  );

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
            disabled={isRegisteringUser || isSameEmail || isFormIncomplete}
            isLoading={isRegisteringUser}
          >
            <LangDisplay text={silverPlanStrings.buttons.sendOTP} />
          </Button>
        </>
      }
    >
      <UserDetailsForm
        onSubmit={onSubmit}
        formId={formId}
        strings={{
          title: silverPlanStrings.title,
          subTitle: silverPlanStrings.subTitle,
          form: strings.form,
        }}
        name={name}
        setName={setName}
        isSubmittingUserDetails={isRegisteringUser}
        email={email}
        setEmail={setEmail}
        alternateEmail={alternateEmail}
        setAlternateEmail={setAlternateEmail}
        isSameEmail={isSameEmail}
        setHasErrors={setHasErrors}
      />
    </Layout>
  );
};
