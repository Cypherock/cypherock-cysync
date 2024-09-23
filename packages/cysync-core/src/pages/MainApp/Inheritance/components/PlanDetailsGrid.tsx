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
import { ILangState } from '~/store';

interface Wallet {
  walletName: string;
  createdOn: string;
  expiringOn: string;
  reminderPeriod: number;
}

interface Owner {
  name: string;
  primaryEmail: string;
  secondaryEmail: string;
}

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

interface InheritancePlanData {
  wallet: Wallet;
  owner: Owner;
  nominees?: Nominee[];
  executor?: Executor;
}

interface PlanDetailsGridProps {
  data: InheritancePlanData;
  strings: ILangState['strings']['inheritance'];
  plan: InheritancePlanType;
}

export const InheritancePlanDetailsGrid: React.FC<PlanDetailsGridProps> = ({
  data,
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
        headerText={data.wallet.walletName}
        headerTrailing={
          <Typography color="gold" $fontSize={16} $fontWeight="semibold">
            {strings.plans[plan].title.toLocaleUpperCase()}
          </Typography>
        }
        $backgroundType={plan === 'gold' ? 'gold' : 'silver'}
        fields={[
          {
            label: strings.planDetails.walletDetails.createdOn,
            icon: ClockIcon,
            value: data.wallet.createdOn,
          },
          {
            label: strings.planDetails.walletDetails.expiringOn,
            icon: ClockIcon,
            value: data.wallet.expiringOn,
            isDanger: true,
          },
          {
            label: strings.planDetails.walletDetails.reminderPeriodField.label,
            icon: ClockIcon,
            value: getReminderPeriodInputText(data.wallet.reminderPeriod),
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
            value: data.owner.name,
          },
          {
            label:
              strings.planDetails.ownerDetails.form.primaryEmailField.label,
            icon: EmailIconSmall,
            value: data.owner.primaryEmail,
          },
          {
            label:
              strings.planDetails.ownerDetails.form.secondaryEmailField.label,
            icon: EmailIconSmall,
            value: data.owner.secondaryEmail,
          },
        ]}
      />
      {plan === 'gold' &&
        data.nominees?.map((nominee, index) => (
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
      {plan === 'gold' && data.executor && (
        <DetailsCard
          headerText={strings.planDetails.executorDetails.title}
          headerTrailing={editButton}
          fields={[
            {
              label:
                strings.planDetails.executorDetails.form.nomineeNameField.label,
              icon: UserIcon,
              value: data.executor.name,
            },
            {
              label:
                strings.planDetails.executorDetails.form.primaryEmailField
                  .label,
              icon: EmailIconSmall,
              value: data.executor.primaryEmail,
            },
            {
              label:
                strings.planDetails.executorDetails.form.secondaryEmailField
                  .label,
              icon: EmailIconSmall,
              value: data.executor.secondaryEmail,
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
