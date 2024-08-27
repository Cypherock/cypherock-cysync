import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { EncryptedMessageIcon, MessageIcon } from '../../assets';
import { EditButton, NomineeMessage } from '../../components';

const meta: Meta<typeof NomineeMessage> = {
  component: NomineeMessage,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NomineeMessage>;

export const EncryptedMessage: Story = {
  args: {
    label: 'Encrypted Message',
    leading: <EncryptedMessageIcon />,
    trailing: <EditButton text="Edit" />,
    withBackground: true,
  },
};

export const ExecutorMessage: Story = {
  args: {
    label: 'Executor Message',
    leading: <MessageIcon />,
    trailing: <EditButton text="Edit" />,
    withBackground: true,
  },
};
