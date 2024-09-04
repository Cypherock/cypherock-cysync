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
  const [selectedNominee, setSelectedNominee] = useState<number | undefined>();

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
            onClick={() => onNext()}
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
            <Flex gap={8} align="center">
              <RadioButton
                checked={selectedNominee === 1}
                onChange={() => {
                  setSelectedNominee(1);
                }}
              />
              <Typography $fontSize={14} color="muted">
                {strings.executor.executorDetails.radio.options.labelOne}
              </Typography>
            </Flex>
            <Flex gap={8} align="center">
              <RadioButton
                checked={selectedNominee === 2}
                onChange={() => {
                  setSelectedNominee(2);
                }}
              />
              <Typography $fontSize={14} color="muted">
                {strings.executor.executorDetails.radio.options.labelTwo}
              </Typography>
            </Flex>
          </Flex>
        </Container>
      </Container>
    </Layout>
  );
};
