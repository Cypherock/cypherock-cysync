import type { Meta, StoryObj } from '@storybook/react';

import { Video } from '../../components/atoms';

const meta: Meta<typeof Video> = {
  component: Video,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    autoPlay: true,
    loop: true,
    controls: true,
    $aspectRatio: 'auto',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
};
