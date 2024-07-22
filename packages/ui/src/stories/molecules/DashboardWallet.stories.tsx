import type { Meta, StoryObj } from '@storybook/react';

import { DashboardWallet } from '../../components';

const meta: Meta<typeof DashboardWallet> = {
  component: DashboardWallet,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isNone: false,
    planType: 'silver',
    isExpiring: false,
    isExpired: false,
    paymentPending: false,
    timerDate: '21 JAN 2024',
    name: 'My Default Wallet',
    walletSubtitle: 'Setup Cypherock Cover',
  },
};

export const SilverPlan: Story = {
  args: {
    ...Default.args,
    planType: 'silver',
  },
};

export const GoldPlan: Story = {
  args: {
    ...Default.args,
    planType: 'gold',
    name: 'My Gold Wallet',
  },
};
