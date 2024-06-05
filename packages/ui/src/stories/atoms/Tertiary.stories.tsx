import type { Meta, StoryObj } from '@storybook/react';

import { Tertiary } from '../../components/atoms';

const meta: Meta<typeof Tertiary> = {
  component: Tertiary,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
