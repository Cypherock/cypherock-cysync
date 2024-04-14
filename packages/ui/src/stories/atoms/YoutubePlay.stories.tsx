import type { Meta, StoryObj } from '@storybook/react';

import { YoutubePlay } from '../../components/atoms';

const meta: Meta<typeof YoutubePlay> = {
  component: YoutubePlay,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
  },
};
