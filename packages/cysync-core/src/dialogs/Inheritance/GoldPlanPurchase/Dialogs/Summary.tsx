import React from 'react';
import { Layout } from '../Layout';
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
import { selectLanguage, useAppSelector } from '~/store';
import { useInheritanceGoldPlanPurchaseDialog } from '../context';

const goldWalletIcon = <WalletIcon fill={`url(#${svgGradients.gold})`} />;

export const Summary = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.summary;

  const { onNext, personalMessage, cardLocation, nomineeDetails, userDetails } =
    useInheritanceGoldPlanPurchaseDialog();

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
          headerText="somewallet"
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
              value: strings.ownerDetails.form.reminderPeriodField.input,
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
