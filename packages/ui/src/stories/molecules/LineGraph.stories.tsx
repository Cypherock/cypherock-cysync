import type { Meta, StoryObj } from '@storybook/react';

import { DisplayGraph } from '../../components';

const meta: Meta<typeof DisplayGraph> = {
  component: DisplayGraph,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: 'Title',
    color: '##351d1d',
    data: [
      {
        timestamp: 1,
        value: 10,
      },
      {
        timestamp: 2,
        value: 15,
      },
      {
        timestamp: 3,
        value: 5,
      },
      {
        timestamp: 4,
        value: 20,
      },
      {
        timestamp: 5,
        value: 3,
      },
    ],
  },
};
