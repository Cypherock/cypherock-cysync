import {
  DetailsCard,
  Typography,
  ClockIcon,
  UserIcon,
  EmailIconSmall,
  parseLangTemplate,
  EncryptedMessageIcon,
  EditButton,
  WalletIcon,
  svgGradients,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

interface DummyPlanDetailsProps {
  plan: 'silver' | 'gold';
}

export const DummyPlanDetails: FC<DummyPlanDetailsProps> = ({ plan }) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;

  const planIconMap = {
    gold: <WalletIcon fill={`url(#${svgGradients.gold})`} />,
    silver: <WalletIcon fill={`url(#${svgGradients.silver})`} />,
  };

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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
        gridTemplateRows: 'auto',
        gridAutoRows: 'auto',
        gridGap: '16px',
        width: '100%',
        filter: 'blur(4px)',
      }}
    >
      <DetailsCard
        headerLeading={planIconMap[plan]}
        headerText="MyFunnyWallet"
        headerTrailing={
          <Typography color={plan} $fontSize={16} $fontWeight="semibold">
            {strings.plans.gold.title.toLocaleUpperCase()}
          </Typography>
        }
        $backgroundType={plan}
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
            label: strings.planDetails.walletDetails.reminderPeriodField.label,
            icon: ClockIcon,
            value: getReminderPeriodInputText(1),
            trailing: editButton,
          },
        ]}
      />
      <DetailsCard
        headerText={strings.planDetails.ownerDetails.title}
        headerTrailing={editButton}
        fields={[
          {
            label: strings.planDetails.ownerDetails.form.userNameField.label,
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
              strings.planDetails.ownerDetails.form.secondaryEmailField.label,
            icon: EmailIconSmall,
            value: 'alfred@psych.com',
          },
        ]}
      />
      {plan === 'gold' && (
        <>
          <DetailsCard
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
        </>
      )}
    </div>
  );
};
