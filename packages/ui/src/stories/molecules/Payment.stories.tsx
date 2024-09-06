import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Payment } from '../../components';

const meta: Meta<typeof Payment> = {
  component: Payment,
  tags: ['autodocs'],
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
        coupon={applied || args.error ? args.coupon || value : value}
        applied={applied}
        onChange={onChange}
        onApply={onApply}
        onDelete={onDelete}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const lang = {
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
  externalLink: 'some link',
  total: 'Total',
  year: 'year',
  error: {
    heading: 'Invalid Coupon Code',
    subtext: 'Please try a different coupon code',
  },
};

export const Default: Story = {
  args: {
    lang,
    applied: false,
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
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: lang.error,
  },
};
