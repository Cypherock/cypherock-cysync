import type { Meta, StoryObj } from '@storybook/react';

import { Edit } from '../../components';

const meta: Meta<typeof Edit> = {
  component: Edit,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: false,
    disabled: false,
  },
};
