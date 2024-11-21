import {
  ClockIcon,
  DetailsCard,
  EmailIconSmall,
  EncryptedMessageIcon,
  parseLangTemplate,
  svgGradients,
  Typography,
  UserIcon,
  WalletIcon,
} from '@cypherock/cysync-ui';
import {
  InheritancePlanType,
  InheritancePlanTypeMap,
} from '@cypherock/db-interfaces';
import React from 'react';

import { ILangState } from '~/store';

interface Wallet {
  walletName: string;
  createdOn: string;
  expiringOn: string;
  reminderPeriod?: number;
  onEdit: () => void;
}

export interface UserDetails {
  name: string;
  primaryEmail: string;
  secondaryEmail?: string;
  onEdit: () => void;
  onSecondaryEdit?: () => void;
}

export interface InheritancePlanData {
  wallet: Wallet;
  owner: UserDetails;
  nominees?: UserDetails[];
  executor?: UserDetails;
}

export interface PlanDetailsGridProps {
  data: InheritancePlanData;
  strings: ILangState['strings']['inheritance'];
  planType: InheritancePlanType;
}

const goldWalletIcon = <WalletIcon fill={`url(#${svgGradients.gold})`} />;

export const InheritancePlanDetailsGrid: React.FC<PlanDetailsGridProps> = ({
  data,
  strings,
  planType,
}) => {
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
          <Typography color={planType} $fontSize={16} $fontWeight="semibold">
            {strings.plans[planType].title.toLocaleUpperCase()}
          </Typography>
        }
        $backgroundType={
          planType === InheritancePlanTypeMap.gold ? 'gold' : 'silver'
        }
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
          ...(data.wallet.reminderPeriod
            ? [
                {
                  label:
                    strings.planDetails.walletDetails.reminderPeriodField.label,
                  icon: ClockIcon,
                  value: getReminderPeriodInputText(data.wallet.reminderPeriod),
                },
              ]
            : []),
        ]}
      />
      <DetailsCard
        headerText={strings.planDetails.ownerDetails.title}
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
      {planType === InheritancePlanTypeMap.gold &&
        data.nominees?.map((nominee, index) => (
          <DetailsCard
            key={nominee.primaryEmail}
            headerText={parseLangTemplate(
              strings.planDetails.nomineeDetails.title,
              { number: index + 1 },
            )}
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
              ...(nominee.secondaryEmail
                ? [
                    {
                      label:
                        strings.planDetails.nomineeDetails.form
                          .secondaryEmailField.label,
                      icon: EmailIconSmall,
                      value: nominee.secondaryEmail,
                    },
                  ]
                : []),
            ]}
            footer={{
              label:
                strings.planDetails.nomineeDetails.form.encryptedMessage.label,
              icon: EncryptedMessageIcon,
            }}
          />
        ))}
      {planType === InheritancePlanTypeMap.gold && data.executor && (
        <DetailsCard
          headerText={strings.planDetails.executorDetails.title}
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
            ...(data.executor.secondaryEmail
              ? [
                  {
                    label:
                      strings.planDetails.executorDetails.form
                        .secondaryEmailField.label,
                    icon: EmailIconSmall,
                    value: data.executor.secondaryEmail,
                  },
                ]
              : []),
          ]}
          footer={{
            label:
              strings.planDetails.executorDetails.form.executorMessage.label,
            icon: EncryptedMessageIcon,
          }}
        />
      )}
    </div>
  );
};
