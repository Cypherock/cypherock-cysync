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

  const { onNext } = useInheritanceGoldPlanPurchaseDialog();
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
          headerTrailing={
            <EditButton text="Edit" onClick={() => alert('Edit Clicked')} />
          }
          fields={[
            {
              label: strings.ownerDetails.form.userNameField.label,
              icon: UserIcon,
              value: 'Alfred Bellows',
            },
            {
              label: strings.ownerDetails.form.primaryEmailField.label,
              icon: EmailIconSmall,
              value: 'doc.bellows@yahoo.com',
            },
            {
              label: strings.ownerDetails.form.secondaryEmailField.label,
              icon: EmailIconSmall,
              value: 'alfred@psych.com',
            },
            {
              label: strings.ownerDetails.form.reminderPeriodField.label,
              icon: ClockIcon,
              value: strings.ownerDetails.form.reminderPeriodField.input,
              trailing: (
                <EditButton
                  text="Edit"
                  onClick={() => {
                    alert('Edit Clicked');
                  }}
                />
              ),
            },
          ]}
        />
        <DetailsCard
          headerText={strings.nomineeDetails.title}
          headerTrailing={
            <EditButton text="Edit" onClick={() => alert('Edit Clicked')} />
          }
          fields={[
            {
              label: strings.nomineeDetails.form.nomineeNameField.label,
              icon: UserIcon,
              value: 'Alfred Bellows',
            },
            {
              label: strings.nomineeDetails.form.primaryEmailField.label,
              icon: EmailIconSmall,
              value: 'doc.bellows@yahoo.com',
            },
            {
              label: strings.nomineeDetails.form.secondaryEmailField.label,
              icon: EmailIconSmall,
              value: 'alfred@psych.com',
            },
          ]}
        />
        <DetailsCard
          headerText={strings.nomineeDetails.title}
          headerTrailing={
            <EditButton text="Edit" onClick={() => alert('Edit Clicked')} />
          }
          fields={[
            {
              label: strings.nomineeDetails.form.nomineeNameField.label,
              icon: UserIcon,
              value: 'Alfred Bellows',
            },
            {
              label: strings.nomineeDetails.form.primaryEmailField.label,
              icon: EmailIconSmall,
              value: 'doc.bellows@yahoo.com',
            },
            {
              label: strings.nomineeDetails.form.secondaryEmailField.label,
              icon: EmailIconSmall,
              value: 'alfred@psych.com',
            },
          ]}
        />
        <DetailsCard
          headerText={strings.cardLocation.title}
          headerTrailing={
            <EditButton
              text="Edit"
              onClick={() => {
                alert('Edit Clicked');
              }}
            />
          }
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget  dapibus est. Mauris varius sapien a diam elementum posuere. Maecenas  aliquam nec justo a dictum. Aliquam eu condimentum mi, eu vulputate  ipsum. Proin vel semper nisl. Donec ultricies consectetur dapibus. Donec  suscipit, mi sed tristique feugiat, urna ipsum viverra risus, vitae  commodo tortor est interdum ligula. Fusce tellus mi, malesuada tristique  mauris a, pulvinar varius metus. Pellentesque habitant morbi tristique  senectus et netus et malesuada fames ac turpis egestas. Donec in nulla  sit amet ex cursus dictum. Nam felis odio, egestas sed porttitor eu,  consequat eget dolor. Phasellus luctus, arcu non auctor euismod, lectus  quam tempus lacus, in sollicitudin elit risus ut ex."
        />
        <DetailsCard
          headerText={strings.personalMessage.title}
          headerTrailing={
            <EditButton
              text="Edit"
              onClick={() => {
                alert('Edit Clicked');
              }}
            />
          }
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget  dapibus est. Mauris varius sapien a diam elementum posuere. Maecenas  aliquam nec justo a dictum. Aliquam eu condimentum mi, eu vulputate  ipsum. Proin vel semper nisl. Donec ultricies consectetur dapibus. Donec  suscipit, mi sed tristique feugiat, urna ipsum viverra risus, vitae  commodo tortor est interdum ligula. Fusce tellus mi, malesuada tristique  mauris a, pulvinar varius metus. Pellentesque habitant morbi tristique  senectus et netus et malesuada fames ac turpis egestas. Donec in nulla  sit amet ex cursus dictum. Nam felis odio, egestas sed porttitor eu,  consequat eget dolor. Phasellus luctus, arcu non auctor euismod, lectus  quam tempus lacus, in sollicitudin elit risus ut ex."
        />
      </ScrollableContainer>
    </Layout>
  );
};

export default Summary;
