import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { AppUpdateIcon } from '../../../assets';
import { ConfirmationDialog } from '../../../components';

const meta: Meta<typeof ConfirmationDialog> = {
  component: ConfirmationDialog,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    subtext: 'Subtext',
    buttonText: 'Button',
    icon: <AppUpdateIcon />,
  },
};
