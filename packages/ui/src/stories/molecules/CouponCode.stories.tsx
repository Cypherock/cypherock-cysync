import type { Meta, StoryObj } from '@storybook/react';

import { Coupon } from '../../components';

const meta: Meta<typeof Coupon> = {
  component: Coupon,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const AppliedState: Story = {
  args: {
    initialState: {
      applied: true,
      code: 'WXAR4450',
    },
  },
};
