import type { Meta, StoryObj } from '@storybook/react';

import { NotificationContainer } from '../../../components';

const meta: Meta<typeof NotificationContainer> = {
  component: NotificationContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    count: 2,
    top: 0,
  },
};
