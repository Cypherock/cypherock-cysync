import type { Meta, StoryObj } from '@storybook/react';

import { Markdown } from '../../components';

const meta: Meta<typeof Markdown> = {
  component: Markdown,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    children: 'Test string',
  },
};
