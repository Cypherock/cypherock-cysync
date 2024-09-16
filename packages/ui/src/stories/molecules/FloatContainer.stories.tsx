import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { FloatContainer } from '../../components';

const meta: Meta<typeof FloatContainer> = {
  component: FloatContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    children: <span>This is base component</span>,
    $floatDirection: 'left',
  },
};
