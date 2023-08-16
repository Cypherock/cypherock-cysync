import type { Meta, StoryObj } from '@storybook/react';

import { Typography } from '../../components/atoms';

const meta: Meta<typeof Typography> = {
  component: Typography,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Cypherock',
  },
};
