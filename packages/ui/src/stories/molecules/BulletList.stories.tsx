import type { Meta, StoryObj } from '@storybook/react';

import { BulletList } from '../../components';

const meta: Meta<typeof BulletList> = {
  component: BulletList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      'This is first text',
      'This is second text',
      'This is third text',
      'This is fourth text',
      'This is fifth text',
    ],
  },
};
