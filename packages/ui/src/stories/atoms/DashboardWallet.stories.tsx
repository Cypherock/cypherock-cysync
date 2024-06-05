import type { Meta, StoryObj } from '@storybook/react';

import { DashboardWallet } from '../../components';

const meta: Meta<typeof DashboardWallet> = {
  component: DashboardWallet,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    isNone: false,
    isSilver: false,
    isExpiring: false,
    isVerified: true,
    timerDate: '21 JAN 2024',
    name: 'Mynonamewallet',
    walletSubtitle: 'Setup Cypherock Cover',
  },
};
