import type { Meta, StoryObj } from '@storybook/react';

import { TableSearch } from '../../../components';

const meta: Meta<typeof TableSearch> = {
  component: TableSearch,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    value: 'Placeholder Value',
  },
};
