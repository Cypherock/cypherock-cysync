import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumb } from '../../components';

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: '1',
        text: 'First',
      },
      {
        id: '2',
        text: 'Second',
      },
      {
        id: '3',
        text: 'Third',
      },
    ],
  },
};
