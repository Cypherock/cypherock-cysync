import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  ClockIcon,
  EmailIconSmall,
  EncryptedMessageIcon,
  UserIcon,
  WalletIconRounded,
} from '../../assets';
import {
  DetailsCard,
  EditButton,
  svgGradients,
  Typography,
} from '../../components';

const meta: Meta<typeof DetailsCard> = {
  component: DetailsCard,
  tags: ['autodocs'],
  parameters: { actions: { argTypesRegex: null } },
};

export default meta;

type Story = StoryObj<typeof meta>;

const editButton = (
  <EditButton text="Edit" onClick={() => alert('Edit Clicked')} />
);

const goldWalletIcon = (
  <WalletIconRounded stroke={`url(#${svgGradients.gold})`} />
);

export const Default: Story = {
  args: {
    headerLeading: goldWalletIcon,
    headerText: 'MyFunnyWallet',
    headerTrailing: editButton,
    $backgroundType: 'gold',
  },
};

export const HeaderOnly: Story = {
  args: {
    headerLeading: goldWalletIcon,
    headerText: 'MyFunnyWallet',
    headerTrailing: editButton,
    headerOnly: true,
    $backgroundType: 'gold',
  },
};

export const OwnerDetails: Story = {
  args: {
    headerText: 'Owner Details',
    headerTrailing: editButton,
    fields: [
      {
        label: 'Name',
        icon: UserIcon,
        value: 'Alfred Bellows',
      },
      {
        label: 'Primary Email',
        icon: EmailIconSmall,
        value: 'doc.bellows@yahoo.com',
      },
      {
        label: 'Secondary Email',
        icon: EmailIconSmall,
        value: 'alfred@psych.com',
      },
      {
        label: 'Reminder Period',
        icon: ClockIcon,
        value: 'Every 3 Months',
        trailing: editButton,
      },
    ],
  },
};

export const WalletDetail: Story = {
  args: {
    headerLeading: goldWalletIcon,
    headerText: 'MyNoNameWallet',
    $backgroundType: 'gold',
    headerTrailing: (
      <Typography color="gold" $fontSize={16} $fontWeight="semibold">
        GOLD
      </Typography>
    ),
    fields: [
      {
        label: 'Created on',
        icon: ClockIcon,
        value: '01 July 2024',
      },
      {
        label: 'Expiring on',
        icon: ClockIcon,
        value: '30 June 2024',
        isDanger: true,
      },
      {
        label: 'Reminder Period',
        icon: ClockIcon,
        value: 'Every 3 Months',
        trailing: editButton,
      },
    ],
  },
};

export const WalletDetailSilver: Story = {
  args: {
    headerLeading: goldWalletIcon,
    headerText: 'MyNoNameWallet',
    $backgroundType: 'silver',
    headerTrailing: (
      <Typography color="silver" $fontSize={16} $fontWeight="semibold">
        SILVER
      </Typography>
    ),
    fields: [
      {
        label: 'Created on',
        icon: ClockIcon,
        value: '01 July 2024',
      },
      {
        label: 'Expiring on',
        icon: ClockIcon,
        value: '30 June 2024',
        isDanger: true,
      },
      {
        label: 'Reminder Period',
        icon: ClockIcon,
        value: 'Every 3 Months',
        trailing: editButton,
      },
    ],
  },
};

export const Nominee: Story = {
  args: {
    headerText: 'Nominee #1',
    headerTrailing: editButton,
    fields: [
      {
        label: 'Name',
        icon: UserIcon,
        value: 'Alfred Bellows',
      },
      {
        label: 'Primary Email',
        icon: EmailIconSmall,
        value: 'doc.bellows@yahoo.com',
      },
      {
        label: 'Secondary Email',
        icon: EmailIconSmall,
        value: 'alfred@psych.com',
      },
    ],
  },
};

export const NomineeWithEncryptedMessage: Story = {
  args: {
    headerText: 'Nominee #1',
    headerTrailing: editButton,
    fields: [
      {
        label: 'Name',
        icon: UserIcon,
        value: 'Alfred Bellows',
      },
      {
        label: 'Primary Email',
        icon: EmailIconSmall,
        value: 'doc.bellows@yahoo.com',
      },
      {
        label: 'Secondary Email',
        icon: EmailIconSmall,
        value: 'alfred@psych.com',
      },
    ],
    footer: {
      label: 'Encrypted Message',
      icon: EncryptedMessageIcon,
      trailing: editButton,
    },
  },
};

export const CardLocation: Story = {
  args: {
    headerText: 'Card Location',
    headerTrailing: editButton,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget  dapibus est. Mauris varius sapien a diam elementum posuere. Maecenas  aliquam nec justo a dictum. Aliquam eu condimentum mi, eu vulputate  ipsum. Proin vel semper nisl. Donec ultricies consectetur dapibus. Donec  suscipit, mi sed tristique feugiat, urna ipsum viverra risus, vitae  commodo tortor est interdum ligula. Fusce tellus mi, malesuada tristique  mauris a, pulvinar varius metus. Pellentesque habitant morbi tristique  senectus et netus et malesuada fames ac turpis egestas. Donec in nulla  sit amet ex cursus dictum. Nam felis odio, egestas sed porttitor eu,  consequat eget dolor. Phasellus luctus, arcu non auctor euismod, lectus  quam tempus lacus, in sollicitudin elit risus ut ex.',
  },
};
