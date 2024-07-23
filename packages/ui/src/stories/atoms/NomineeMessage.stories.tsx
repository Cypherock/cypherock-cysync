import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { EncryptedMessageIcon, MessageIcon } from '../../assets';
import { NomineeMessage } from '../../components';

const meta: Meta<typeof NomineeMessage> = {
  component: NomineeMessage,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NomineeMessage>;

export const EncryptedMessage: Story = {
  args: {
    text: 'Encrypted Message',
    icon: <EncryptedMessageIcon />,
    actionText: 'Edit',
    onAction: () => console.log('edit clicked'),
  },
};

export const ExecutorMessage: Story = {
  args: {
    text: 'Executor Message',
    icon: <MessageIcon />,
    actionText: 'Edit',
    onAction: () => console.log('edit clicked'),
  },
};
