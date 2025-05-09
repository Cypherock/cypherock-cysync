import type { Meta, StoryObj } from '@storybook/react';

import { Timer } from '../../components/molecules';

const meta: Meta<typeof Timer> = {
  component: Timer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    title: 'Expiring In',
    minutes: '12',
    minutesLabel: 'Minutes',
    seconds: '00',
    secondsLabel: 'Seconds',
  },
};
