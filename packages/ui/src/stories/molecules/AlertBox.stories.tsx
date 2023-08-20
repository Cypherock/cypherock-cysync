import type { Meta, StoryObj } from '@storybook/react';

import { AlertBox } from '../../components';

const meta: Meta<typeof AlertBox> = {
  component: AlertBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    alert: 'Alert Text',
  },
};

export const Warning: Story = {
  args: {
    ...Info.args,
    variant: 'warning',
  },
};

export const None: Story = {
  args: {
    ...Info.args,
    variant: 'none',
  },
};
