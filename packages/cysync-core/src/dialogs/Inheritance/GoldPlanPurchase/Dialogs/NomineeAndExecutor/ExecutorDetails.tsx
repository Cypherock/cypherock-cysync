import { Button, LangDisplay } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { UserDetailsForm } from '../../components';
import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const ExecutorDetails = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor;
  const { form } = lang.strings.inheritanceGoldPlanPurchase.email.userDetails;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');

  const {
    onExecutorDetailsSubmit,
    onPrevious,
    onNext,
    isSubmittingExecutorDetails,
  } = useInheritanceGoldPlanPurchaseDialog();

  const formId = 'inheritance-gold-plan-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmittingExecutorDetails) return;

    onExecutorDetailsSubmit({
      name,
      email,
      alternateEmail,
    });
    onNext();
  };

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => onPrevious()}
            variant="secondary"
            disabled={isSubmittingExecutorDetails}
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            variant="primary"
            type="submit"
            form={formId}
            disabled={isSubmittingExecutorDetails}
            isLoading={isSubmittingExecutorDetails}
          >
            <LangDisplay text={lang.strings.buttons.next} />
          </Button>
        </>
      }
    >
      <UserDetailsForm
        onSubmit={onSubmit}
        formId={formId}
        strings={{ title: strings.executor.executorDetails.title, form }}
        name={name}
        setName={setName}
        isSubmittingUserDetails={isSubmittingExecutorDetails}
        email={email}
        setEmail={setEmail}
        alternateEmail={alternateEmail}
        setAlternateEmail={setAlternateEmail}
      />
    </Layout>
  );
};
