import type { Meta, StoryObj } from '@storybook/react';

import { Payment } from '../../components';

const meta: Meta<typeof Payment> = {
  component: Payment,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const lang = {
  payment: {
    heading: 'Buy plan on the Cypherock website',
    form: {
      promoField: {
        label: 'Promo code / coupon',
        placeholder: 'Enter code',
      },
    },
    couponInput: {
      appliedButtonText: 'Coupon applied:',
      applyButtonText: 'Apply',
    },
    noOfYear: 'Number of years',
    total: 'Total',
    year: 'year',
    error: {
      errorHeading: 'Invalid Coupon Code',
      errorDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  },
};

export const Default: Story = {
  args: {
    lang,
    applied: false,
    error: false,
  },
};

export const Applied: Story = {
  ...Default.args,
  args: {
    lang,
    applied: true,
    year: 2,
    amount: '$100',
  },
};

export const Error: Story = {
  ...Default.args,
  args: {
    lang,
    error: true,
  },
};
