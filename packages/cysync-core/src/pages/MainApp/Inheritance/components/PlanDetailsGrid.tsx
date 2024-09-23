import {
  ClockIcon,
  DetailsCard,
  EditButton,
  EmailIconSmall,
  EncryptedMessageIcon,
  parseLangTemplate,
  svgGradients,
  Typography,
  UserIcon,
  WalletIcon,
} from '@cypherock/cysync-ui';
import { InheritancePlanType } from '@cypherock/db-interfaces';
import React from 'react';

interface Nominee {
  name: string;
  primaryEmail: string;
  secondaryEmail: string;
}

interface Executor {
  name: string;
  primaryEmail: string;
  secondaryEmail: string;
}

interface PlanDetailsGridProps {
  walletName: string;
  createdOn: string;
  expiringOn: string;
  reminderPeriod: number;
  ownerName: string;
  ownerPrimaryEmail: string;
  ownerSecondaryEmail: string;
  nominees?: Nominee[];
  executor?: Executor;
  strings: any;
  plan: InheritancePlanType;
}

export const InheritancePlanDetailsGrid: React.FC<PlanDetailsGridProps> = ({
  walletName,
  createdOn,
  expiringOn,
  reminderPeriod,
  ownerName,
  ownerPrimaryEmail,
  ownerSecondaryEmail,
  nominees = [],
  executor,
  strings,
  plan,
}) => {
  const goldWalletIcon = <WalletIcon fill={`url(#${svgGradients.gold})`} />;
  const editButton = (
    <EditButton text="Edit" onClick={() => alert('Edit Clicked')} />
  );

  const getReminderPeriodInputText = (newPeriod: number) => {
    const reminderPeriodInput =
      strings.planDetails.walletDetails.reminderPeriodField;
    return parseLangTemplate(
      newPeriod === 1
        ? reminderPeriodInput.input
        : reminderPeriodInput.inputPlural,
      { month: newPeriod },
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
      }}
    >
      <DetailsCard
        headerLeading={goldWalletIcon}
        headerText={walletName}
        headerTrailing={
          <Typography color="gold" $fontSize={16} $fontWeight="semibold">
            {strings.plans[plan].title.toLocaleUpperCase()}
          </Typography>
        }
        $backgroundType={plan === 'gold' ? 'gold' : 'silver'} // Adjust background type based on plan
        fields={[
          {
            label: strings.planDetails.walletDetails.createdOn,
            icon: ClockIcon,
            value: createdOn,
          },
          {
            label: strings.planDetails.walletDetails.expiringOn,
            icon: ClockIcon,
            value: expiringOn,
            isDanger: true,
          },
          {
            label: strings.planDetails.walletDetails.reminderPeriodField.label,
            icon: ClockIcon,
            value: getReminderPeriodInputText(reminderPeriod),
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
            value: ownerName,
          },
          {
            label:
              strings.planDetails.ownerDetails.form.primaryEmailField.label,
            icon: EmailIconSmall,
            value: ownerPrimaryEmail,
          },
          {
            label:
              strings.planDetails.ownerDetails.form.secondaryEmailField.label,
            icon: EmailIconSmall,
            value: ownerSecondaryEmail,
          },
        ]}
      />
      {plan === 'gold' &&
        nominees.map((nominee, index) => (
          <DetailsCard
            key={nominee.primaryEmail}
            headerText={parseLangTemplate(
              strings.planDetails.nomineeDetails.title,
              { number: index + 1 },
            )}
            headerTrailing={editButton}
            fields={[
              {
                label:
                  strings.planDetails.nomineeDetails.form.nomineeNameField
                    .label,
                icon: UserIcon,
                value: nominee.name,
              },
              {
                label:
                  strings.planDetails.nomineeDetails.form.primaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: nominee.primaryEmail,
              },
              {
                label:
                  strings.planDetails.nomineeDetails.form.secondaryEmailField
                    .label,
                icon: EmailIconSmall,
                value: nominee.secondaryEmail,
              },
            ]}
            footer={{
              label:
                strings.planDetails.nomineeDetails.form.encryptedMessage.label,
              icon: EncryptedMessageIcon,
              trailing: editButton,
            }}
          />
        ))}
      {plan === 'gold' && executor && (
        <DetailsCard
          headerText={strings.planDetails.executorDetails.title}
          headerTrailing={editButton}
          fields={[
            {
              label:
                strings.planDetails.executorDetails.form.nomineeNameField.label,
              icon: UserIcon,
              value: executor.name,
            },
            {
              label:
                strings.planDetails.executorDetails.form.primaryEmailField
                  .label,
              icon: EmailIconSmall,
              value: executor.primaryEmail,
            },
            {
              label:
                strings.planDetails.executorDetails.form.secondaryEmailField
                  .label,
              icon: EmailIconSmall,
              value: executor.secondaryEmail,
            },
          ]}
          footer={{
            label:
              strings.planDetails.executorDetails.form.executorMessage.label,
            icon: EncryptedMessageIcon,
            trailing: editButton,
          }}
        />
      )}
    </div>
  );
};

InheritancePlanDetailsGrid.defaultProps = {
  nominees: undefined,
  executor: undefined,
};
