import type { Meta, StoryObj } from '@storybook/react';

import { SilverButton } from '../../components';

const meta: Meta<typeof SilverButton> = {
  component: SilverButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
