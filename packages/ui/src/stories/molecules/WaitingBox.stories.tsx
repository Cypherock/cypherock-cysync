import type { Meta, StoryObj } from '@storybook/react';

import { WaitingBox } from '../../components';

const meta: Meta<typeof WaitingBox> = {
  component: WaitingBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    text: 'This is a info message',
    type: 'info',
  },
};

export const Warning: Story = {
  args: {
    text: 'This is a warning message',
    type: 'warning',
  },
};
