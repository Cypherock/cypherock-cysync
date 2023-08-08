import type { Meta, StoryObj } from '@storybook/react';

import { Milestone } from '../../components';

const meta: Meta<typeof Milestone> = {
  component: Milestone,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentState: 3,
    totalState: 6,
  },
};
