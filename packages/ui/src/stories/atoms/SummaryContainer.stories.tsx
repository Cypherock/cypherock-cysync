import type { Meta, StoryObj } from '@storybook/react';

import { SummaryContainer } from '../../components/atoms';

const meta: Meta<typeof SummaryContainer> = {
  component: SummaryContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    margin: undefined,
    leftComponent: undefined,
    rightComponent: undefined,
  },
};
