import type { Meta, StoryObj } from '@storybook/react';

import { TableSearchFilter } from '../../../components';

const meta: Meta<typeof TableSearchFilter> = {
  component: TableSearchFilter,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    placeholder: 'Placeholder',
  },
};
