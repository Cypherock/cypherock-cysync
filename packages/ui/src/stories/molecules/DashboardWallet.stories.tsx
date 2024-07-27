import type { Meta, StoryObj } from '@storybook/react';

import { DashboardWallet } from '../../components';

const meta: Meta<typeof DashboardWallet> = {
  component: DashboardWallet,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const lang = {
  dashboard: {
    wallet: {
      renewNow: 'Renew Now',
      buyNow: 'Buy Now',
      created: 'Created',
      expiredOn: 'Expired on',
      expiresIn: 'Expires in',
      expiry: 'Expiry',
      expiring: 'Expiring',
      expired: 'Expired',
      pendingTime: '05',
      silver: 'Silver',
      gold: 'Gold',
      hours: 'Hours',
    },
  },
};

export const Default: Story = {
  args: {
    isNone: false,
    planType: 'silver',
    isExpiring: false,
    isExpired: false,
    paymentPending: false,
    name: 'My Default Wallet',
    lang,
    startDate: '2024-01-21',
    expiryDate: '2024-09-21',
    status: 'Active',
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

export const ExpiringPlan: Story = {
  args: {
    ...Default.args,
    isExpiring: true,
  },
};

export const ExpiredPlan: Story = {
  args: {
    ...Default.args,
    isExpired: true,
    expiryDate: '2023-01-21',
  },
};

export const PendingPayment: Story = {
  args: {
    ...Default.args,
    paymentPending: true,
  },
};
