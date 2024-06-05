import type { Meta, StoryObj } from '@storybook/react';

import { ChangePlan } from '../../components';

const meta: Meta<typeof ChangePlan> = {
  component: ChangePlan,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Downgrade: Story = {
  args: {
    downgrade: true,
    text: 'Downgrade to Silver plan with less features',
    hoverText: 'Some features will not work anymore',
  },
};
export const Upgrade: Story = {
  args: {
    downgrade: false,
    text: 'Upgrade to Gold plan with more features',
    hoverText: 'Enjoy more benefits and better asset transfer',
  },
};
