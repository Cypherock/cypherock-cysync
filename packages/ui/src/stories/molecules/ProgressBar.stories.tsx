import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from '../../components';

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    progress: 46,
    text: 'Downloading',
  },
};
