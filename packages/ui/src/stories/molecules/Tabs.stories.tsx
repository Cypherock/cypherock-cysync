import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from '../../components';

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    tabs: [
      {
        label: 'First',
        content: 'First Content',
      },
      {
        label: 'Second',
        content: 'Second Content',
      },

      {
        label: 'Third',
        content: 'Third Content',
      },
    ],
  },
};
