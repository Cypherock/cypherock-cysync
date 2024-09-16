import type { Meta, StoryObj } from '@storybook/react';

import { JoystickInteraction } from '../../components';

const meta: Meta<typeof JoystickInteraction> = {
  component: JoystickInteraction,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Initial: Story = {};

export const DirectionsSelected: Story = {
  args: { up: 'selected' },
};

export const DirectionsCompleted: Story = {
  args: {
    up: 'completed',
    right: 'completed',
    down: 'selected',
  },
};

export const AllDirectionsCompleted: Story = {
  args: {
    up: 'completed',
    right: 'completed',
    down: 'completed',
    left: 'completed',
  },
};
