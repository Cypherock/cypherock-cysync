import type { Meta, StoryObj } from '@storybook/react';

import { Indicator } from '../../components/atoms';

const meta: Meta<typeof Indicator> = {
  component: Indicator,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    state: 'success',
  },
};

export const Failed: Story = {
  args: {
    state: 'failed',
  },
};

export const Focused: Story = {
  args: {
    state: 'focused',
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
  },
};
