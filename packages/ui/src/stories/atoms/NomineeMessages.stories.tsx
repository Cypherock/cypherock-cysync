import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { DocumentEncryption1, SystemUiconsMessage } from '../../assets';
import { NomineeMessage } from '../../components/atoms/NomineeMessages';

const meta: Meta<typeof NomineeMessage> = {
  component: NomineeMessage,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    placeholder: { control: 'text' },
    onEdit: { action: 'edit clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof NomineeMessage>;

export const EncryptedMessage: Story = {
  args: {
    icon: <DocumentEncryption1 />,
    placeholder: 'Encrypted Message',
    onEdit: () => console.log('edit clicked'),
  },
};

export const ExecutorMessage: Story = {
  args: {
    icon: <SystemUiconsMessage />,
    placeholder: 'Executor Message',
    onEdit: () => console.log('edit clicked'),
  },
};
