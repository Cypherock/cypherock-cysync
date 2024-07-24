import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { CouponInput } from '../../components';

const meta: Meta<typeof CouponInput> = {
  component: CouponInput,
  render: args => {
    const [code, setCode] = React.useState('');

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value);
    };

    return (
      <CouponInput
        {...args}
        code={code}
        onChange={onChange}
        onApply={() => console.log('Coupon applied')}
        onDelete={() => console.log('Coupon deleted')}
      />
    );
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    applied: false,
    couponCode: '',
    couponText: 'Coupon Applied:',
    buttonText: 'APPLY',
  },
};

export const AppliedState: Story = {
  args: {
    applied: true,
    couponCode: 'WXAR4450',
    couponText: 'Coupon Applied :',
    buttonText: 'APPLY',
  },
};
