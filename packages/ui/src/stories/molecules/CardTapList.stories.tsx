import type { Meta, StoryObj } from '@storybook/react';

import { CardTapList } from '../../components';

const meta: Meta<typeof CardTapList> = {
  component: CardTapList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    items: [
      {
        text: 'Tap this card',
        currentState: 2,
        totalState: 3,
      },
    ],
  },
};

export const Failed: Story = {
  args: {
    items: [
      {
        text: 'Tap this card',
        currentState: 2,
        totalState: 3,
        currentFailed: true,
      },
    ],
  },
};
