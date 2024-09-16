import {
  ArrowBackGoldenIcon,
  Button,
  ClockIcon,
  Container,
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
import React, { FC, useCallback } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { InheritancePageLayout } from './Layout';
import { useDispatch } from 'react-redux';
import {
  openInheritanceEditEncryptedMessageDialog,
  openInheritanceEditExecutorMessageDialog,
  openInheritanceEditReminderTimeDialog,
  openInheritanceEditUserDetailsDialog,
} from '~/actions';
import { useNavigate } from 'react-router-dom';
import { InheritanceEditUserDetailsDialogProps } from '~/dialogs/Inheritance';

export const InheritancePlanDetails: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goldWalletIcon = <WalletIcon fill={`url(#${svgGradients.gold})`} />;

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

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const openInheritanceEditUserDetails = useCallback(
    (params: InheritanceEditUserDetailsDialogProps) => {
      dispatch(openInheritanceEditUserDetailsDialog(params));
    },
    [dispatch],
  );

  const openInheritanceEditReminderTime = useCallback(() => {
    dispatch(openInheritanceEditReminderTimeDialog());
  }, [dispatch]);

  const openInheritanceEditEncryptedMessage = useCallback(() => {
    dispatch(openInheritanceEditEncryptedMessageDialog());
  }, [dispatch]);

  const openInheritanceEditExecutorMessage = useCallback(() => {
    dispatch(openInheritanceEditExecutorMessageDialog());
  }, [dispatch]);

  return (
    <InheritancePageLayout>
      <Container direction="column" gap={32} justify="flex-start">
        <Container width="100%" justify="space-between" pt={4}>
          <Button
            variant="icon"
            icon={<ArrowBackGoldenIcon />}
            onClick={onBack}
          />
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
                trailing: (
                  <EditButton
                    text={lang.strings.buttons.edit}
                    onClick={openInheritanceEditReminderTime}
                  />
                ),
              },
            ]}
          />
          <DetailsCard
            $flex={1}
            headerText={strings.planDetails.ownerDetails.title}
            headerTrailing={
              <EditButton
                text={lang.strings.buttons.edit}
                onClick={() =>
                  openInheritanceEditUserDetails({ userType: 'owner' })
                }
              />
            }
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
            headerTrailing={
              <EditButton
                text={lang.strings.buttons.edit}
                onClick={() =>
                  openInheritanceEditUserDetails({ userType: 'nominee' })
                }
              />
            }
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
              trailing: (
                <EditButton
                  text={lang.strings.buttons.edit}
                  onClick={openInheritanceEditEncryptedMessage}
                />
              ),
            }}
          />
          <DetailsCard
            $flex={1}
            headerText={parseLangTemplate(
              strings.planDetails.nomineeDetails.title,
              { number: 2 },
            )}
            headerTrailing={
              <EditButton
                text={lang.strings.buttons.edit}
                onClick={() =>
                  openInheritanceEditUserDetails({ userType: 'nominee' })
                }
              />
            }
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
              trailing: (
                <EditButton
                  text={lang.strings.buttons.edit}
                  onClick={openInheritanceEditEncryptedMessage}
                />
              ),
            }}
          />
          <DetailsCard
            $flex={1}
            headerText={strings.planDetails.executorDetails.title}
            headerTrailing={
              <EditButton
                text={lang.strings.buttons.edit}
                onClick={() =>
                  openInheritanceEditUserDetails({ userType: 'executor' })
                }
              />
            }
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
              trailing: (
                <EditButton
                  text={lang.strings.buttons.edit}
                  onClick={openInheritanceEditExecutorMessage}
                />
              ),
            }}
          />
        </Container>
      </Container>
    </InheritancePageLayout>
  );
};
