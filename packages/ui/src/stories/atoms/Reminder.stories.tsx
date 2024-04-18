import type { Meta, StoryObj } from '@storybook/react';

import { Reminder } from '../../components';

const meta: Meta<typeof Reminder> = {
  component: Reminder,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    date: '3 Months',
    disabled: false,
  },
};
