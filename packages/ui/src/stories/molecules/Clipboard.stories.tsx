import type { Meta, StoryObj } from '@storybook/react';

import { Clipboard } from '../../components';

const meta: Meta<typeof Clipboard> = {
  component: Clipboard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Gold: Story = {
  args: {
    variant: 'gold',
    content: 'This is the clipboard content',
  },
};

export const White: Story = {
  args: {
    ...Gold.args,
    variant: 'white',
  },
};
