import type { StoryObj, Meta } from '@storybook/react';
import React from 'react';

import { Chip } from '../../components';

const meta: Meta<typeof Chip> = {
  component: Chip,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <span style={{ color: 'white' }}>Chip Box</span>,
    p: 2,
  },
};
