import {
  Button,
  ClockIcon,
  Container,
  DetailsCard,
  EditButton,
  EmailIconSmall,
  LangDisplay,
  parseLangTemplate,
  ScrollableContainer,
  svgGradients,
  Typography,
  UserIcon,
  WalletIconRounded,
} from '@cypherock/cysync-ui';
import React, { useCallback, useEffect, useMemo } from 'react';

import { ReminderPeriod } from '~/services/inheritance/login/schema';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../context';
import { tabIndicies } from '../context/useDialogHandler';
import { Layout } from '../Layout';

const goldWalletIcon = (
  <WalletIconRounded stroke={`url(#${svgGradients.gold})`} />
);

const reminderValueMap: Record<ReminderPeriod, number> = {
  monthly: 1,
  quarterly: 3,
  'half-yearly': 6,
  yearly: 12,
};

export const Summary = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.summary;

  const {
    onNext,
    personalMessage,
    cardLocation,
    nomineeDetails,
    userDetails,
    selectedWallet,
    reminderPeriod,
    executorMessage,
    executorDetails,
    setIsOnSummaryPage,
    goTo,
    executorNomineeIndex,
    walletAuthReset,
  } = useInheritanceGoldPlanPurchaseDialog();

  const reminderValue = useMemo(
    () => reminderValueMap[reminderPeriod],
    [reminderPeriod],
  );

  useEffect(() => {
    setIsOnSummaryPage(true);
  }, []);

  const editButtonGoto = useCallback(
    (tab: number, dialog?: number, preRun?: () => void) => (
      <EditButton
        text={lang.strings.buttons.edit}
        onClick={() => {
          preRun?.();
          goTo(tab, dialog);
        }}
      />
    ),
    [lang, goTo],
  );

  return (
    <Layout
      footerComponent={
        <Button
          onClick={() => {
            setIsOnSummaryPage(false);
            onNext();
          }}
        >
          <LangDisplay text={lang.strings.buttons.continue} />
        </Button>
      }
    >
      <Container direction="column" gap={4} mb={2}>
        <Typography $fontSize={20} color="white">
          {strings.title}
        </Typography>
        <Typography $fontSize={16} color="muted">
          {strings.subtitle}
        </Typography>
      </Container>

      <ScrollableContainer
        direction="column"
        display="flex"
        gap={8}
        $maxHeight={400}
      >
        <DetailsCard
          headerLeading={goldWalletIcon}
          headerText={selectedWallet?.name ?? ''}
          headerOnly
          $backgroundType="gold"
        />
        <DetailsCard
          headerText={strings.ownerDetails.title}
          headerTrailing={editButtonGoto(
            tabIndicies.wallet.tabNumber,
            tabIndicies.wallet.dialogs.fetchRequestId,
            walletAuthReset,
          )}
          fields={[
            {
              label: strings.ownerDetails.form.userNameField.label,
              icon: UserIcon,
              value: userDetails?.name,
            },
            {
              label: strings.ownerDetails.form.primaryEmailField.label,
              icon: EmailIconSmall,
              value: userDetails?.email,
            },
            {
              label: strings.ownerDetails.form.secondaryEmailField.label,
              icon: EmailIconSmall,
              value: userDetails?.alternateEmail,
            },
            {
              label: strings.ownerDetails.form.reminderPeriodField.label,
              icon: ClockIcon,
              value: parseLangTemplate(
                strings.ownerDetails.form.reminderPeriodField[
                  reminderValue === 1 ? 'input' : 'inputPlural'
                ],
                { month: reminderValue },
              ),
              trailing: editButtonGoto(tabIndicies.reminder.tabNumber),
            },
          ]}
        />
        {Object.values(nomineeDetails).map((details, index) => (
          <DetailsCard
            key={JSON.stringify(details)}
            headerText={strings.nomineeDetails.title + (index + 1).toString()}
            headerTrailing={editButtonGoto(
              tabIndicies.nominieeAndExecutor.tabNumber,
              tabIndicies.nominieeAndExecutor.dialogs.firstNomineeDetails +
                (tabIndicies.nominieeAndExecutor.dialogs.secondNomineeDetails -
                  tabIndicies.nominieeAndExecutor.dialogs.firstNomineeDetails) *
                  index,
            )}
            fields={[
              {
                label: strings.nomineeDetails.form.nomineeNameField.label,
                icon: UserIcon,
                value: details.name,
              },
              {
                label: strings.nomineeDetails.form.primaryEmailField.label,
                icon: EmailIconSmall,
                value: details.email,
              },
              ...(details.alternateEmail
                ? [
                    {
                      label:
                        strings.nomineeDetails.form.secondaryEmailField.label,
                      icon: EmailIconSmall,
                      value: details.alternateEmail,
                    },
                  ]
                : []),
            ]}
          />
        ))}
        <DetailsCard
          headerText={strings.cardLocation.title}
          headerTrailing={editButtonGoto(
            tabIndicies.message.tabNumber,
            tabIndicies.message.dialogs.personalMessageInput,
          )}
          text={cardLocation}
        />
        <DetailsCard
          headerText={strings.personalMessage.title}
          headerTrailing={editButtonGoto(
            tabIndicies.message.tabNumber,
            tabIndicies.message.dialogs.personalMessageInput,
          )}
          text={personalMessage}
        />
        {executorDetails && (
          <DetailsCard
            headerText={strings.executorDetails.title}
            headerTrailing={editButtonGoto(
              tabIndicies.nominieeAndExecutor.tabNumber,
              tabIndicies.nominieeAndExecutor.dialogs.executorDetails,
            )}
            fields={[
              {
                label: strings.executorDetails.form.nomineeNameField.label,
                icon: UserIcon,
                value: executorDetails.name,
              },
              {
                label: strings.executorDetails.form.primaryEmailField.label,
                icon: EmailIconSmall,
                value: executorDetails.email,
              },
              ...(executorDetails.alternateEmail
                ? [
                    {
                      label:
                        strings.executorDetails.form.secondaryEmailField.label,
                      icon: EmailIconSmall,
                      value: executorDetails.alternateEmail,
                    },
                  ]
                : []),
              {
                label: strings.executorDetails.form.assignTo.label,
                icon: UserIcon,
                value:
                  strings.nomineeDetails.title +
                  ((executorNomineeIndex ?? 0) + 1).toString(),
              },
            ]}
          />
        )}

        {executorMessage && (
          <DetailsCard
            headerText={strings.executorMessage.title}
            headerTrailing={editButtonGoto(
              tabIndicies.message.tabNumber,
              tabIndicies.message.dialogs.executorMessageInput,
            )}
            text={executorMessage}
          />
        )}
      </ScrollableContainer>
    </Layout>
  );
};

export default Summary;
