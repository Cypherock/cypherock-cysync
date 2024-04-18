import type { Meta, StoryObj } from '@storybook/react';

import { ChangePlan } from '../../components';

const meta: Meta<typeof ChangePlan> = {
  component: ChangePlan,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    downgrade: false,
  },
};
