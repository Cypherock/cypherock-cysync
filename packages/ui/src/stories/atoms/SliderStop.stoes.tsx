import type { Meta, StoryObj } from '@storybook/react';

import { SliderStop } from '../../components';

const meta: Meta<typeof SliderStop> = {
  component: SliderStop,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    Label: '5 Years',
    isSelected: false,
    isActive: false,
  },
};
