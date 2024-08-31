import {
  ArrowBackGoldenIcon,
  Button,
  ClockIcon,
  Container,
  DetailsCard,
  EditButton,
  EmailIconSmall,
  EncryptedMessageIcon,
  svgGradients,
  Typography,
  UserIcon,
  WalletIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { InheritancePageLayout } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

export const PlanDetails: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
  const goldWalletIcon = <WalletIcon fill={`url(#${svgGradients.gold})`} />;
  const editButton = (
    <EditButton text="Edit" onClick={() => alert('Edit Clicked')} />
  );

  return (
    <InheritancePageLayout>
      <Container direction="column" gap={32} justify="flex-start">
        <Container width="100%" justify="flex-start" pt={4}>
          <Button
            variant="icon"
            icon={<ArrowBackGoldenIcon />}
            onClick={() => {
              'implement this function';
            }}
          />
        </Container>
        <Container
          direction="row"
          $flexWrap="wrap"
          gap={16}
          $flex={1}
          width="100%"
          justify="flex-start"
          align="flex-start"
        >
          <DetailsCard
            headerLeading={goldWalletIcon}
            headerText="MyFunnyWallet"
            headerTrailing={
              <Typography color="gold" $fontSize={16} $fontWeight="semibold">
                {strings.planDetails.walletDetails.plan.gold}
              </Typography>
            }
            $backgroundType="gold"
            fields={[
              {
                label: strings.planDetails.walletDetails.createdOn,
                icon: ClockIcon,
                value: '01 July 2024',
              },
              {
                label: strings.planDetails.walletDetails.expiringOn,
                icon: ClockIcon,
                value: '30 June 2024',
                isDanger: true,
              },
              {
                label:
                  strings.planDetails.walletDetails.reminderPeriodField.label,
                icon: ClockIcon,
                value:
                  strings.planDetails.walletDetails.reminderPeriodField.input,
                trailing: editButton,
              },
            ]}
          />
          <DetailsCard
            headerText={strings.planDetails.ownerDetails.title}
            headerTrailing={editButton}
            fields={[
              {
                label:
                  strings.planDetails.ownerDetails.form.userNameField.label,
                icon: UserIcon,
                value: 'Alfred Bellows',
              },
              {
                label:
                  strings.planDetails.ownerDetails.form.primaryEmailField.label,
                icon: EmailIconSmall,
                value: 'doc.bellows@yahoo.com',
              },
              {
                label:
                  strings.planDetails.ownerDetails.form.secondaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: 'alfred@psych.com',
              },
            ]}
          />
          <DetailsCard
            headerText={strings.planDetails.nomineeDetails.title}
            headerTrailing={editButton}
            fields={[
              {
                label:
                  strings.planDetails.nomineeDetails.form.nomineeNameField
                    .label,
                icon: UserIcon,
                value: 'Alfred Bellows',
              },
              {
                label:
                  strings.planDetails.nomineeDetails.form.primaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: 'doc.bellows@yahoo.com',
              },
              {
                label:
                  strings.planDetails.nomineeDetails.form.secondaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: 'alfred@psych.com',
              },
            ]}
            footer={{
              label:
                strings.planDetails.nomineeDetails.form.encryptedMessage.label,
              icon: EncryptedMessageIcon,
              trailing: editButton,
            }}
          />
          <DetailsCard
            headerText={strings.planDetails.nomineeDetails.title}
            headerTrailing={editButton}
            fields={[
              {
                label:
                  strings.planDetails.nomineeDetails.form.nomineeNameField
                    .label,
                icon: UserIcon,
                value: 'Alfred Bellows',
              },
              {
                label:
                  strings.planDetails.nomineeDetails.form.primaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: 'doc.bellows@yahoo.com',
              },
              {
                label:
                  strings.planDetails.nomineeDetails.form.secondaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: 'alfred@psych.com',
              },
            ]}
            footer={{
              label:
                strings.planDetails.nomineeDetails.form.encryptedMessage.label,
              icon: EncryptedMessageIcon,
              trailing: editButton,
            }}
          />
          <DetailsCard
            headerText={strings.planDetails.executorDetails.title}
            headerTrailing={editButton}
            fields={[
              {
                label:
                  strings.planDetails.executorDetails.form.nomineeNameField
                    .label,
                icon: UserIcon,
                value: 'Alfred Bellows',
              },
              {
                label:
                  strings.planDetails.executorDetails.form.primaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: 'doc.bellows@yahoo.com',
              },
              {
                label:
                  strings.planDetails.executorDetails.form.secondaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: 'alfred@psych.com',
              },
            ]}
            footer={{
              label:
                strings.planDetails.executorDetails.form.executorMessage.label,
              icon: EncryptedMessageIcon,
              trailing: editButton,
            }}
          />
        </Container>
      </Container>
    </InheritancePageLayout>
  );
};
