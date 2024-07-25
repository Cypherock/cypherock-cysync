import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { CouponInput } from '../../components';

const meta: Meta<typeof CouponInput> = {
  component: CouponInput,
  render: args => {
    const [value, setValue] = React.useState('');
    const [applied, setApplied] = React.useState(args.isApplied || false);

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
      <CouponInput
        {...args}
        value={applied ? args.value || value : value}
        isApplied={applied}
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

export const Default: Story = {
  args: {
    appliedText: 'Coupon Applied:',
    applyButtonText: 'APPLY',
    placeholderText: 'Enter Coupon Code',
  },
};

export const AppliedState: Story = {
  args: {
    appliedText: 'Coupon Applied:',
    applyButtonText: 'APPLY',
    value: 'WW3vfAt',
    isApplied: true,
    placeholderText: 'Enter Coupon Code',
  },
};
