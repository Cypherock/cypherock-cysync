import type { Meta, StoryObj } from '@storybook/react';

import { Throbber } from '../../components/atoms';

const meta: Meta<typeof Throbber> = {
  component: Throbber,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 18,
    strokeWidth: 2,
  },
};
