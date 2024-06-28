import type { Meta, StoryObj } from '@storybook/react';

import { Wallet } from '../../components';

const meta: Meta<typeof Wallet> = {
  component: Wallet,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Wallet name',
  },
};
