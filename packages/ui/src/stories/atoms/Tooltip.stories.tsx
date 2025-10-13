import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Tooltip } from '../../components/atoms/Tooltip';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isActive: true,
    text: undefined,
    children: <span>Base Comp</span>,
  },
};

export const TopTooltip: Story = {
  args: {
    ...Default.args,
    tooltipPlacement: 'top',
  },
};

export const BottomTooltip: Story = {
  args: {
    ...Default.args,
    tooltipPlacement: 'bottom',
  },
};
