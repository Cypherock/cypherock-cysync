import { Button, LangDisplay } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { UserDetailsForm } from '../../components';
import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const NomineeDetails = () => {
  const lang = useAppSelector(selectLanguage);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');

  const { form } = lang.strings.inheritanceGoldPlanPurchase.email.userDetails;
  const strings =
    lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor.nomineeDetails;

  const { onNomineeDetailsSubmit, onPrevious, isSubmittingNomineeDetails } =
    useInheritanceGoldPlanPurchaseDialog();

  const formId = 'inheritance-gold-plan-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingNomineeDetails) return;
    onNomineeDetailsSubmit({
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
            disabled={isSubmittingNomineeDetails}
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            variant="primary"
            type="submit"
            form={formId}
            disabled={isSubmittingNomineeDetails}
            isLoading={isSubmittingNomineeDetails}
          >
            <LangDisplay text={lang.strings.buttons.next} />
          </Button>
        </>
      }
    >
      <UserDetailsForm
        onSubmit={onSubmit}
        formId={formId}
        strings={{
          title: strings.first.title,
          form,
        }}
        name={name}
        setName={setName}
        isSubmittingUserDetails={isSubmittingNomineeDetails}
        email={email}
        setEmail={setEmail}
        alternateEmail={alternateEmail}
        setAlternateEmail={setAlternateEmail}
      />
    </Layout>
  );
};
