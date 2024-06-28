import type { Meta, StoryObj } from '@storybook/react';

import { SliderStop } from '../../components';

const meta: Meta<typeof SliderStop> = {
  component: SliderStop,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Label: '5 Years',
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    Label: '5 Years',
    isActive: true,
  },
};
