import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Payment } from '../../components';

const meta: Meta<typeof Payment> = {
  component: Payment,
  render: args => {
    const [value, setValue] = React.useState('');
    const [applied, setApplied] = React.useState(args.applied || false);

    const onChange = (_value: string) => {
      setValue(_value);
    };

    const onApply = () => {
      if (value.trim() !== '') {
        setApplied(true);
      }
    };

    const onDelete = () => {
      setValue('');
      setApplied(false);
    };

    return (
      <Payment
        {...args}
        coupon={applied || args.isError ? args.coupon || value : value}
        applied={applied}
        onChange={onChange}
        onApply={onApply}
        onDelete={onDelete}
      />
    );
  },
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
    },
  },
};

export const Default: Story = {
  args: {
    lang,
    applied: false,
    isError: false,
    onApply: () => {
      // Dummy functions
    },
    onDelete: () => {
      // Dummy functions
    },
  },
};

export const Applied: Story = {
  args: {
    ...Default.args,
    applied: true,
    year: 2,
    amount: '$100',
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    isError: true,
    error: 'This coupon is invalid!This coupon is invalid!',
  },
};
