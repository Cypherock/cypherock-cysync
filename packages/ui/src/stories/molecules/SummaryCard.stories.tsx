import type { Meta, StoryObj } from '@storybook/react';

import { SummaryCard } from '../../components';

const meta: Meta<typeof SummaryCard> = {
  component: SummaryCard,
  tags: ['autodocs'],
  parameters: { actions: { argTypesRegex: null } },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headerIcon: 'wallet',
    headerText: 'MyFunnyWallet',
    onHeaderEdit: () => alert('Header Edited'),
    $backgroundType: 'gold',
  },
};

export const OwnerDetails: Story = {
  args: {
    headerText: 'Owner Details',
    onHeaderEdit: () => alert('Header Edited'),
    fields: [
      {
        label: 'User Name',
        icon: 'user',
        value: 'Alfred Bellows',
      },
      {
        label: 'Primary Email',
        icon: 'email',
        value: 'doc.bellows@yahoo.com',
      },
      {
        label: 'Secondary Email',
        icon: 'email',
        value: 'alfred@psych.com',
      },
      {
        label: 'Reminder Period',
        icon: 'clock',
        value: 'Every 3 Months',
        onEdit: () => {
          alert('Edited Reminder');
        },
      },
    ],
  },
};

export const WalletDetail: Story = {
  args: {
    headerIcon: 'wallet',
    headerText: 'MyNoNameWallet',
    $backgroundType: 'gold',
    fields: [
      {
        label: 'Created on',
        icon: 'clock',
        value: '01 July 2024',
      },
      {
        label: 'Expiring on',
        icon: 'clock',
        value: '30 June 2024',
        isDanger: true,
      },
      {
        label: 'Reminder Period',
        icon: 'clock',
        value: 'Every 3 Months',
        onEdit: () => {
          alert('Edited Reminder');
        },
      },
    ],
  },
};

export const WalletDetailSilver: Story = {
  args: {
    headerIcon: 'wallet',
    headerText: 'MyNoNameWallet',
    $backgroundType: 'silver',
    fields: [
      {
        label: 'Created on',
        icon: 'clock',
        value: '01 July 2024',
      },
      {
        label: 'Expiring on',
        icon: 'clock',
        value: '30 June 2024',
        isDanger: true,
      },
      {
        label: 'Reminder Period',
        icon: 'clock',
        value: 'Every 3 Months',
        onEdit: () => {
          alert('Edited Reminder');
        },
      },
    ],
  },
};

export const Nominee: Story = {
  args: {
    headerText: 'Nominee #1',
    onHeaderEdit: () => alert('Header Edited'),
    fields: [
      {
        label: 'Nominee Name',
        icon: 'user',
        value: 'Alfred Bellows',
      },
      {
        label: 'Primary Email',
        icon: 'email',
        value: 'doc.bellows@yahoo.com',
      },
      {
        label: 'Secondary Email',
        icon: 'email',
        value: 'alfred@psych.com',
      },
    ],
  },
};

export const NomineeWithEncryptedMessage: Story = {
  args: {
    headerText: 'Nominee #1',
    onHeaderEdit: () => alert('Header Edited'),
    fields: [
      {
        label: 'Nominee Name',
        icon: 'user',
        value: 'Alfred Bellows',
      },
      {
        label: 'Primary Email',
        icon: 'email',
        value: 'doc.bellows@yahoo.com',
      },
      {
        label: 'Secondary Email',
        icon: 'email',
        value: 'alfred@psych.com',
      },
    ],
    footer: {
      label: 'Encrypted Message',
      icon: 'encrypted',
      onEdit: () => alert('Edited message'),
    },
  },
};

export const CardLocation: Story = {
  args: {
    headerText: 'Card Location',
    onHeaderEdit: () => alert('Edited Card location'),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget  dapibus est. Mauris varius sapien a diam elementum posuere. Maecenas  aliquam nec justo a dictum. Aliquam eu condimentum mi, eu vulputate  ipsum. Proin vel semper nisl. Donec ultricies consectetur dapibus. Donec  suscipit, mi sed tristique feugiat, urna ipsum viverra risus, vitae  commodo tortor est interdum ligula. Fusce tellus mi, malesuada tristique  mauris a, pulvinar varius metus. Pellentesque habitant morbi tristique  senectus et netus et malesuada fames ac turpis egestas. Donec in nulla  sit amet ex cursus dictum. Nam felis odio, egestas sed porttitor eu,  consequat eget dolor. Phasellus luctus, arcu non auctor euismod, lectus  quam tempus lacus, in sollicitudin elit risus ut ex.',
  },
};
