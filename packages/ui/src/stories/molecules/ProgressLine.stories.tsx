import type { Meta, StoryObj } from '@storybook/react';

import { ProgressLine } from '../../components';

const meta: Meta<typeof ProgressLine> = {
  component: ProgressLine,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {},
};
