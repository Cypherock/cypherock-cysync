import type { Meta, StoryObj } from '@storybook/react';

import { ArrowButton } from '../../components/atoms';

const meta: Meta<typeof ArrowButton> = {
  component: ArrowButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  args: {
    variant: 'enabled',
    direction: 'left',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'disabled',
    direction: 'left',
  },
};
