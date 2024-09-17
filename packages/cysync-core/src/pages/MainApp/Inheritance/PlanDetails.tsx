import {
  ArrowBackGoldenIcon,
  Button,
  ClockIcon,
  Container,
  DetailsCard,
  EditButton,
  EmailIconSmall,
  EncryptedMessageIcon,
  Flex,
  parseLangTemplate,
  svgGradients,
  Typography,
  UserIcon,
  WalletIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { InheritancePageLayout } from './Layout';

export const InheritancePlanDetails: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
  const goldWalletIcon = <WalletIcon fill={`url(#${svgGradients.gold})`} />;
  const editButton = (
    <EditButton text="Edit" onClick={() => alert('Edit Clicked')} />
  );

  const getReminderPeriodInputText = (reminderPeriod: number) => {
    const reminderPeriodInput =
      strings.planDetails.walletDetails.reminderPeriodField;
    return parseLangTemplate(
      reminderPeriod === 1
        ? reminderPeriodInput.input
        : reminderPeriodInput.inputPlural,
      { month: reminderPeriod },
    );
  };

  return (
    <InheritancePageLayout>
      <Container direction="column" gap={32} justify="flex-start">
        <Container width="100%" justify="space-between" pt={4}>
          <Button
            variant="icon"
            icon={<ArrowBackGoldenIcon />}
            onClick={() => {
              'implement this function';
            }}
          />
          <Flex justify="center" gap={16}>
            <Button
              variant="secondary"
              onClick={() => {
                'impliment this function';
              }}
            >
              {strings.buttons.recoverPin}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                'impliment this function';
              }}
            >
              {strings.buttons.upgradePlan}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                'impliment this function';
              }}
            >
              {strings.buttons.renewPlan}
            </Button>
          </Flex>
        </Container>
        <Container
          direction="row"
          gap={16}
          $flexWrap="wrap"
          $flex={1}
          width="100%"
          justify="flex-start"
          align="flex-start"
        >
          <DetailsCard
            $flex={1}
            headerLeading={goldWalletIcon}
            headerText="MyFunnyWallet"
            headerTrailing={
              <Typography color="gold" $fontSize={16} $fontWeight="semibold">
                {strings.plans.gold.title.toLocaleUpperCase()}
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
                value: getReminderPeriodInputText(1),
                trailing: editButton,
              },
            ]}
          />
          <DetailsCard
            $flex={1}
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
            $flex={1}
            headerText={parseLangTemplate(
              strings.planDetails.nomineeDetails.title,
              { number: 1 },
            )}
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
            $flex={1}
            headerText={parseLangTemplate(
              strings.planDetails.nomineeDetails.title,
              { number: 2 },
            )}
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
            $flex={1}
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
