import type { Meta, StoryObj } from '@storybook/react';

import { PillButtonToggle } from '../../components';

const meta: Meta<typeof PillButtonToggle> = {
  component: PillButtonToggle,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    type: 'info',
    buttons: [
      {
        id: 1,
        label: 'first',
        type: 'info',
      },
      {
        id: 2,
        label: 'second',
        type: 'primary',
      },
      {
        id: 3,
        label: 'third',
        type: 'info',
      },
    ],
  },
};
