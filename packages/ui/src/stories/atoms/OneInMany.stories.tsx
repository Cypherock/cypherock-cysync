import type { Meta, StoryObj } from '@storybook/react';

import { OneInMany } from '../../components';

const meta: Meta<typeof OneInMany> = {
  component: OneInMany,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: 'YES',
    description: 'Description goes here',
  },
};
