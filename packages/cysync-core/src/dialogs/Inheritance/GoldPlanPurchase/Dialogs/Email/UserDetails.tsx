import { Button, LangDisplay } from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useState } from 'react';

import { UserDetailsForm } from '~/dialogs/Inheritance/components';
import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const UserDetails = () => {
  const lang = useAppSelector(selectLanguage);

  const goldPlanStrings =
    lang.strings.inheritanceGoldPlanPurchase.email.userDetails;

  const {
    registerUser,
    onPrevious,
    onNext,
    isRegisteringUser,
    walletAuthStep,
    userDetailPrefillData,
    isOnSummaryPage,
  } = useInheritanceGoldPlanPurchaseDialog();

  const [name, setName] = useState(userDetailPrefillData.name);
  const [email, setEmail] = useState(userDetailPrefillData.email);
  const [alternateEmail, setAlternateEmail] = useState(
    userDetailPrefillData.alternateEmail,
  );

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

  const isSameEmail = useMemo(
    () => Boolean(email && email === alternateEmail),
    [email, alternateEmail],
  );

  const [hasErrors, setHasErrors] = useState(false);
  const isFormIncomplete = useMemo(
    () => !name || !email || !alternateEmail || hasErrors,
    [hasErrors, name, email, alternateEmail],
  );

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => onPrevious()}
            variant="secondary"
            disabled={isRegisteringUser || isOnSummaryPage}
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
        isSameEmail={isSameEmail}
        setHasErrors={setHasErrors}
      />
    </Layout>
  );
};
