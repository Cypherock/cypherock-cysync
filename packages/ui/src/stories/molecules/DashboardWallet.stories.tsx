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
      setupCover: 'Setup Cypherock Cover',
    },
  },
};

export const Default: Story = {
  args: {
    isNone: false,
    type: 'silver',
    isExpiring: false,
    isExpired: false,
    isPaymentPending: false,
    name: 'My Default Wallet',
    lang,
    startDate: new Date('2024-01-21').getTime(),
    expiryDate: new Date('2025-09-21').getTime(),
  },
};

export const SetupCover: Story = {
  args: {
    ...Default.args,
    isNone: true,
  },
};

export const SilverPlan: Story = {
  args: {
    ...Default.args,
    type: 'silver',
  },
};

export const GoldPlan: Story = {
  args: {
    ...Default.args,
    type: 'gold',
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
    expiryDate: new Date('2023-01-21').getTime(),
  },
};

export const PendingPayment: Story = {
  args: {
    ...Default.args,
    isPaymentPending: true,
  },
};
