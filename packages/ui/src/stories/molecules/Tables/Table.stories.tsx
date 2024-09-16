import type { Meta, StoryObj } from '@storybook/react';

import { Table } from '../../../components';

const meta: Meta<typeof Table> = {
  component: Table,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
