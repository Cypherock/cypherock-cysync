import type { Meta, StoryObj } from '@storybook/react';

import { GoldenArrowList } from '../../components';

const meta: Meta<typeof GoldenArrowList> = {
  component: GoldenArrowList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      'This is list item 1',
      'This is list item 2',
      'This is list item 3',
      'This is list item 4',
      'This is list item 5',
    ],
  },
};
