import type { Meta, StoryObj } from '@storybook/react';

import Coupon from '../../components/molecules/Coupon';

const meta: Meta<typeof Coupon> = {
  title: 'Components/Coupon',
  component: Coupon,
  argTypes: {
    initialState: {
      control: 'object',
      description: 'Initial state of the coupon code application form',
    },
  },
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
