import type { Meta, StoryObj } from '@storybook/react';

import { ShowMore } from '../../components/atoms';

const meta: Meta<typeof ShowMore> = {
  component: ShowMore,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Show More',
  },
};
