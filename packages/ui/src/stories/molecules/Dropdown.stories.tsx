import type { Meta, StoryObj } from '@storybook/react';

import { Dropdown } from '../../components';

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        text: 'This is item 1',
      },
      {
        text: 'This is item 2',
      },
      {
        text: 'This is item 3',
      },
      {
        text: 'This is item 4',
      },
      {
        text: 'This is item 5',
      },
    ],
  },
} as Story;
