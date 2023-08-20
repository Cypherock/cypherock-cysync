import type { Meta, StoryObj } from '@storybook/react';

import { SearchBar } from '../../components/atoms';

const meta: Meta<typeof SearchBar> = {
  component: SearchBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Placeholder',
  },
};
