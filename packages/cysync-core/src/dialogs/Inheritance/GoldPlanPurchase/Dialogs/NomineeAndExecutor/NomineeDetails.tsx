import { Button, LangDisplay } from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { UserDetailsForm } from '../../components';
import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { tabIndicies } from '../../context/useDialogHandler';
import { Layout } from '../../Layout';

export const NomineeDetails: React.FC<{ index: number }> = ({ index }) => {
  const lang = useAppSelector(selectLanguage);

  const { form } = lang.strings.inheritanceGoldPlanPurchase.email.userDetails;
  const strings =
    lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor.nomineeDetails[
      index === 0 ? 'first' : 'second'
    ];

  const {
    onNext,
    updateNomineeDetails,
    goTo,
    onPrevious,
    isOnSummaryPage,
    nomineeDetails,
  } = useInheritanceGoldPlanPurchaseDialog();

  const details = useMemo(() => nomineeDetails[index], [nomineeDetails]);

  const [name, setName] = useState(details?.name ?? '');
  const [email, setEmail] = useState(details?.email ?? '');
  const [alternateEmail, setAlternateEmail] = useState(
    details?.alternateEmail ?? '',
  );

  const formId = 'inheritance-gold-plan-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateNomineeDetails(
      {
        name,
        email,
        alternateEmail,
      },
      index,
    );
    onNext();
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
            disabled={isOnSummaryPage}
            variant="secondary"
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button variant="primary" type="submit" form={formId}>
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
        isSubmittingUserDetails={false}
        email={email}
        setEmail={setEmail}
        alternateEmail={alternateEmail}
        setAlternateEmail={setAlternateEmail}
        isAlternateEmailRequired={false}
      />
    </Layout>
  );
};
