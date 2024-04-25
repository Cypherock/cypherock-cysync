import type { Meta, StoryObj } from '@storybook/react';

import { FeesInput } from '../../../components';

const meta: Meta<typeof FeesInput> = {
  component: FeesInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '10',
  },
};
