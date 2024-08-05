import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ClockIcon, WalletIcon, EmailIcon, UserIcon } from '../../assets';
import { Summary } from '../../components';

const meta: Meta<typeof Summary> = {
  component: Summary,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    details: [
      {
        title: 'MyFunnyWallet',
        icon: <WalletIcon fill="#E9B873" />,
        actionText: 'Edit',
        value: '',
        isEditable: true,
      },
    ],
    onAction: () => alert('Action clicked'),
    showHeaderView: true,
    linearGradient:
      'linear-gradient(263deg, rgba(139, 100, 41, 0.14) 5.24%, rgba(38, 34, 31, 0.00) 55.22%), #272320',
    width: '100%',
  },
};

export const withOwnerDetails: Story = {
  args: {
    details: [
      {
        title: 'Owner Details',
        icon: '',
        actionText: 'Edit',
        value: '',
        isEditable: true,
      },
      {
        title: 'User Name',
        icon: <UserIcon width={16} height={16} key="wallet" />,
        value: 'Alfred Bellows',
        isEditable: false,
      },
      {
        title: 'Primary Email',
        icon: <WalletIcon width={16} height={16} key="encrypted" />,
        value: 'doc.bellows@yahoo.com',
        isEditable: false,
      },
      {
        title: 'Secondary Email',
        icon: <WalletIcon width={16} height={16} key="edit" />,
        value: 'alfred@psych.com',
        isEditable: false,
      },
      {
        title: 'Reminder Period',
        icon: <ClockIcon key="clock" width={16} height={16} stroke="white" />,
        actionText: 'Edit',
        value: 'Every 3 Months',
        isEditable: true,
      },
    ],
    onAction: () => alert('Action clicked'),
    showPersonDetails: true,
    width: '100%',
  },
};

export const withNomineeOne: Story = {
  args: {
    details: [
      {
        title: 'Nominee #1',
        icon: '',
        actionText: 'Edit',
        value: '',
        isEditable: true,
      },
      {
        title: 'Nominee Name',
        icon: <UserIcon width={16} height={16} key="wallet" />,
        value: 'Alfred Bellows',
        isEditable: false,
      },
      {
        title: 'Primary Email',
        icon: <WalletIcon width={16} height={16} key="encrypted" />,
        value: 'doc.bellows@yahoo.com',
        isEditable: false,
      },
      {
        title: 'Secondary Email',
        icon: <EmailIcon key="email" width={16} height={16} stroke="white" />,
        value: 'alfred@psych.com',
        isEditable: false,
      },
    ],
    onAction: () => alert('Action clicked'),
    showPersonDetails: true,
    width: '100%',
  },
};

export const withNomineeTwo: Story = {
  args: {
    details: [
      {
        title: 'Nominee #2',
        icon: '',
        actionText: 'Edit',
        value: '',
        isEditable: true,
      },
      {
        title: 'Nominee Name',
        icon: <UserIcon width={16} height={16} key="wallet" />,
        value: 'Alfred Bellows',
        isEditable: false,
      },
      {
        title: 'Primary Email',
        icon: <WalletIcon width={16} height={16} key="encrypted" />,
        value: 'doc.bellows@yahoo.com',
        isEditable: false,
      },
      {
        title: 'Secondary Email',
        icon: <EmailIcon key="email" width={16} height={16} stroke="white" />,
        value: 'alfred@psych.com',
        isEditable: false,
      },
    ],
    onAction: () => alert('Action clicked'),
    showPersonDetails: true,
    width: '100%',
  },
};

export const WithCardLocationView: Story = {
  args: {
    details: [
      {
        title: 'Card Location',
        icon: (
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'blue',
              borderRadius: '50%',
            }}
          />
        ),
        actionText: 'Edit',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget  dapibus est. Mauris varius sapien a diam elementum posuere. Maecenas  aliquam nec justo a dictum. Aliquam eu condimentum mi, eu vulputate  ipsum. Proin vel semper nisl. Donec ultricies consectetur dapibus. Donec  suscipit, mi sed tristique feugiat, urna ipsum viverra risus, vitae  commodo tortor est interdum ligula. Fusce tellus mi, malesuada tristique  mauris a, pulvinar varius metus. Pellentesque habitant morbi tristique  senectus et netus et malesuada fames ac turpis egestas. Donec in nulla  sit amet ex cursus dictum. Nam felis odio, egestas sed porttitor eu,  consequat eget dolor. Phasellus luctus, arcu non auctor euismod, lectus  quam tempus lacus, in sollicitudin elit risus ut ex.',
        isEditable: true,
      },
    ],
    onAction: () => alert('Custom Action clicked'),
    showMessageCard: true,
    width: '100%',
  },
};

export const WithPersonalMessageView: Story = {
  args: {
    details: [
      {
        title: 'Personal Message',
        icon: (
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'blue',
              borderRadius: '50%',
            }}
          />
        ),
        actionText: 'Edit',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget  dapibus est. Mauris varius sapien a diam elementum posuere. Maecenas  aliquam nec justo a dictum. Aliquam eu condimentum mi, eu vulputate  ipsum. Proin vel semper nisl. Donec ultricies consectetur dapibus. Donec  suscipit, mi sed tristique feugiat, urna ipsum viverra risus, vitae  commodo tortor est interdum ligula. Fusce tellus mi, malesuada tristique  mauris a, pulvinar varius metus. Pellentesque habitant morbi tristique  senectus et netus et malesuada fames ac turpis egestas. Donec in nulla  sit amet ex cursus dictum. Nam felis odio, egestas sed porttitor eu,  consequat eget dolor. Phasellus luctus, arcu non auctor euismod, lectus  quam tempus lacus, in sollicitudin elit risus ut ex.',
        isEditable: true,
      },
    ],
    onAction: () => alert('Custom Action clicked'),
    showMessageCard: true,
    width: '100%',
  },
};

export const withExecutorDetailView: Story = {
  args: {
    details: [
      {
        title: 'Executor Name',
        icon: '',
        actionText: 'Edit',
        value: '',
        isEditable: true,
      },
      {
        title: 'Nominee Name',
        icon: <UserIcon width={16} height={16} key="wallet" />,
        value: 'Alfred Bellows',
        isEditable: false,
      },
      {
        title: 'Primary Email',
        icon: <WalletIcon width={16} height={16} key="encrypted" />,
        value: 'doc.bellows@yahoo.com',
        isEditable: false,
      },
      {
        title: 'Secondary Email',
        icon: <EmailIcon key="email" width={16} height={16} stroke="white" />,
        value: 'alfred@psych.com',
        isEditable: false,
      },
    ],
    onAction: () => alert('Action clicked'),
    showPersonDetails: true,
    width: '100%',
  },
};

export const withExecutorMessage: Story = {
  args: {
    details: [
      {
        title: 'Executor Message',
        icon: (
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'blue',
              borderRadius: '50%',
            }}
          />
        ),
        actionText: 'Edit',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget  dapibus est. Mauris varius sapien a diam elementum posuere. Maecenas  aliquam nec justo a dictum. Aliquam eu condimentum mi, eu vulputate  ipsum. Proin vel semper nisl. Donec ultricies consectetur dapibus. Donec  suscipit, mi sed tristique feugiat, urna ipsum viverra risus, vitae  commodo tortor est interdum ligula. Fusce tellus mi, malesuada tristique  mauris a, pulvinar varius metus. Pellentesque habitant morbi tristique  senectus et netus et malesuada fames ac turpis egestas. Donec in nulla  sit amet ex cursus dictum. Nam felis odio, egestas sed porttitor eu,  consequat eget dolor. Phasellus luctus, arcu non auctor euismod, lectus  quam tempus lacus, in sollicitudin elit risus ut ex.',
        isEditable: true,
      },
    ],
    onAction: () => alert('Custom Action clicked'),
    showMessageCard: true,
    width: '100%',
  },
};
