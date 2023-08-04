import type { Meta, StoryObj } from '@storybook/react';

import { BlurOverlay } from '../../components/atoms';

const meta: Meta<typeof BlurOverlay> = {
  component: BlurOverlay,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
