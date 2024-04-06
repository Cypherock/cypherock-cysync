import type { Meta, StoryObj } from '@storybook/react';

import { NoSearchResult } from '../../components/atoms';

const meta: Meta<typeof NoSearchResult> = {
  component: NoSearchResult,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subText: 'Go to Home',
    searchText: 'Result not found',
    text: 'text',
  },
};
