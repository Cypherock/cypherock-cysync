import type { Meta, StoryObj } from '@storybook/react';

import { Calendar } from '../../components';

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {},
};
