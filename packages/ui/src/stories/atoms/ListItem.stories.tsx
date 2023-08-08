import type { Meta, StoryObj } from '@storybook/react';

import { ListItem } from '../../components/atoms';

const meta: Meta<typeof ListItem> = {
  component: ListItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a list item',
  },
};
