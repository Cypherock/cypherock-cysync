import {
  Button,
  Container,
  Flex,
  LangDisplay,
  QuestionMarkButton,
  RadioButton,
  Tooltip,
  Typography,
} from '@cypherock/cysync-ui';
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
  const [selectedNominee, setSelectedNominee] = useState(0);

  const {
    onExecutorDetailsSubmit,
    onPrevious,
    isSubmittingExecutorDetails,
    nomineeCount,
    isOnSummaryPage,
  } = useInheritanceGoldPlanPurchaseDialog();

  const formId = 'inheritance-gold-plan-user-details';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmittingExecutorDetails) return;

    onExecutorDetailsSubmit(
      {
        name,
        email,
        alternateEmail,
      },
      selectedNominee,
    );
  };

  return (
    <Layout
      footerComponent={
        <>
          <Button
            onClick={() => onPrevious()}
            variant="secondary"
            disabled={isSubmittingExecutorDetails || isOnSummaryPage}
          >
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            variant="primary"
            type="submit"
            form={formId}
            isLoading={isSubmittingExecutorDetails}
          >
            <LangDisplay text={lang.strings.buttons.next} />
          </Button>
        </>
      }
    >
      <Container direction="column" $flex={1} width="100%" gap={24}>
        <UserDetailsForm
          onSubmit={onSubmit}
          formId={formId}
          strings={{
            title: strings.executor.executorDetails.title,
            form: {
              ...form,
              emailField: {
                label: form.emailField.label,
                tooltip: strings.executor.executorDetails.tooltip,
              },
            },
          }}
          name={name}
          setName={setName}
          isSubmittingUserDetails={isSubmittingExecutorDetails}
          email={email}
          setEmail={setEmail}
          alternateEmail={alternateEmail}
          setAlternateEmail={setAlternateEmail}
          isAlternateEmailRequired={false}
        />
        <Container
          direction="column"
          gap={16}
          $flex={1}
          width="100%"
          align="flex-start"
        >
          <Flex gap={4} align="center">
            <Typography $fontSize={16} color="muted">
              {strings.executor.executorDetails.radio.label}
            </Typography>
            <Tooltip
              text={strings.executor.executorDetails.tooltip}
              tooltipPlacement="bottom"
            >
              <QuestionMarkButton />
            </Tooltip>
          </Flex>
          <Flex gap={40}>
            {Array(nomineeCount)
              .fill(0)
              .map((_, index) => (
                <Flex
                  gap={8}
                  align="center"
                  key={`Nominee ${index + 1}`}
                  onClick={() => setSelectedNominee(index)}
                >
                  <RadioButton checked={selectedNominee === index} />
                  <Typography $fontSize={14} color="muted">
                    {strings.executor.executorDetails.radio.options
                      .labelPrefix + (index + 1).toString()}
                  </Typography>
                </Flex>
              ))}
          </Flex>
        </Container>
      </Container>
    </Layout>
  );
};
