import type { Meta, StoryObj } from '@storybook/react';

import { AllocationShare } from '../../../components';

const meta: Meta<typeof AllocationShare> = {
  component: AllocationShare,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    percentage: 30,
    color: 'white',
  },
};
