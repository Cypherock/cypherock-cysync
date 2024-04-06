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
