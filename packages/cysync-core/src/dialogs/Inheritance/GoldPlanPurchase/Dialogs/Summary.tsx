import {
  Button,
  ClockIcon,
  Container,
  DetailsCard,
  EditButton,
  EmailIconSmall,
  LangDisplay,
  ScrollableContainer,
  svgGradients,
  Typography,
  UserIcon,
  WalletIcon,
} from '@cypherock/cysync-ui';
import React, { useMemo } from 'react';
import { ReminderPeriod } from '~/services/inheritance/login/schema';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';

const goldWalletIcon = <WalletIcon fill={`url(#${svgGradients.gold})`} />;

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
  } = useInheritanceGoldPlanPurchaseDialog();

  const reminderValue = useMemo(
    () => reminderValueMap[reminderPeriod],
    [reminderPeriod],
  );

  return (
    <Layout
      footerComponent={
        <Button onClick={() => onNext()}>
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
          headerTrailing={<EditButton text="Edit" />}
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
              value: `Every ${reminderValue} month${
                reminderValue !== 1 ? 's' : ''
              }`,
              trailing: <EditButton text="Edit" />,
            },
          ]}
        />
        {Object.values(nomineeDetails)?.map((details, index) => (
          <DetailsCard
            key={JSON.stringify(details)}
            headerText={strings.nomineeDetails.title + (index + 1).toString()}
            headerTrailing={<EditButton text="Edit" />}
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
              {
                label: strings.nomineeDetails.form.secondaryEmailField.label,
                icon: EmailIconSmall,
                value: details.alternateEmail,
              },
            ]}
          />
        ))}
        <DetailsCard
          headerText={strings.cardLocation.title}
          headerTrailing={<EditButton text="Edit" />}
          text={cardLocation}
        />
        <DetailsCard
          headerText={strings.personalMessage.title}
          headerTrailing={<EditButton text="Edit" />}
          text={personalMessage}
        />
      </ScrollableContainer>
    </Layout>
  );
};

export default Summary;