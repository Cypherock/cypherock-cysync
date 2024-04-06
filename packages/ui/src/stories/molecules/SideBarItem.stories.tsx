import type { Meta, StoryObj } from '@storybook/react';

import { SideBarItem } from '../../components';

const meta: Meta<typeof SideBarItem> = {
  component: SideBarItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    text: 'Placeholder',
    state: 4,
  },
};
