import type { Meta, StoryObj } from '@storybook/react';

import { NotificationGroupHeader } from '../../../components';

const meta: Meta<typeof NotificationGroupHeader> = {
  component: NotificationGroupHeader,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Placeholder Notification text',
  },
};
