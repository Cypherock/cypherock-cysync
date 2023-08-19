import type { Meta, StoryObj } from '@storybook/react';

import { Divider } from '../../components/atoms';

const meta: Meta<typeof Divider> = {
  component: Divider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    variant: 'vertical',
  },
};
export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
  },
};
