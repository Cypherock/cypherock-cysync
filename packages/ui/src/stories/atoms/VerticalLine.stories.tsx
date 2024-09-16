import type { Meta, StoryObj } from '@storybook/react';

import { VerticalLine } from '../../components/atoms';

const meta: Meta<typeof VerticalLine> = {
  component: VerticalLine,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    $borderStyle: 'dotted',
    height: 40,
  },
};
