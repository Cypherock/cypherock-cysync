import type { Meta, StoryObj } from '@storybook/react';

import { Toggle } from '../../components/atoms';

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};
