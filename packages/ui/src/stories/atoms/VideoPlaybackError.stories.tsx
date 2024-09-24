import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlaybackError } from '../../components/atoms/VideoPlaybackError';

const meta: Meta<typeof VideoPlaybackError> = {
  component: VideoPlaybackError,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      'No internet connection. Please check your connection and try again',
  },
};

export const Big: Story = {
  args: {
    size: 'big',
    children:
      'No internet connection. Please check your connection and try again',
  },
};
