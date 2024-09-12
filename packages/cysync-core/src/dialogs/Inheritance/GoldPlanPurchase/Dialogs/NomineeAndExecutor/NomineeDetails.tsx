import { Button, LangDisplay } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { UserDetailsForm } from '../../components';
import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { tabIndicies } from '../../context/useDialogHandler';
import { Layout } from '../../Layout';

export const NomineeDetails: React.FC<{ index: number }> = ({ index }) => {
  const lang = useAppSelector(selectLanguage);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');

  const { form } = lang.strings.inheritanceGoldPlanPurchase.email.userDetails;
  const strings =
    lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor.nomineeDetails[
      index === 0 ? 'first' : 'second'
    ];

  const {
    onNomineeDetailsSubmit,
    goTo,
    onPrevious,
    isSubmittingNomineeDetails,
  } = useInheritanceGoldPlanPurchaseDialog();

  const formId = 'inheritance-gold-plan-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingNomineeDetails) return;
    onNomineeDetailsSubmit(
      {
        name,
        email,
        alternateEmail,
      },
      index,
    );
  };

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() =>
              index === 0
                ? onPrevious()
                : goTo(
                    tabIndicies.nominieeAndExecutor.tabNumber,
                    tabIndicies.nominieeAndExecutor.dialogs.firstNomineeDetails,
                  )
            }
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
          title: strings.title,
          form: {
            ...form,
            emailField: {
              tooltip: (strings as any)?.tooltip ?? '',
              label: form.emailField.label,
            },
          },
        }}
        name={name}
        setName={setName}
        isSubmittingUserDetails={isSubmittingNomineeDetails}
        email={email}
        setEmail={setEmail}
        alternateEmail={alternateEmail}
        setAlternateEmail={setAlternateEmail}
        isAlternateEmailRequired={false}
      />
    </Layout>
  );
};
