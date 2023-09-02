import type { Meta, StoryObj } from '@storybook/react';

import { Bullet } from '../../components/atoms';

const meta: Meta<typeof Bullet> = {
  component: Bullet,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Gold: Story = {
  args: {
    variant: 'gold',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

export const Failed: Story = {
  args: {
    variant: 'failed',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
  },
};
