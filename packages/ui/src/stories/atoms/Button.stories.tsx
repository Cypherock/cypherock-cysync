import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Lock } from '../../assets';
import { Button } from '../../components/atoms';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
  },
};

export const Warning: Story = {
  args: {
    ...Primary.args,
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    ...Primary.args,
    variant: 'danger',
  },
};

export const Text: Story = {
  args: {
    ...Primary.args,
    variant: 'text',
  },
};

export const Icon: Story = {
  args: {
    variant: 'icon',
    icon: <Lock />,
  },
};
