import type { Meta, StoryObj } from '@storybook/react';

import { RadioButton } from '../../components/atoms';

const meta: Meta<typeof RadioButton> = {
  component: RadioButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};
