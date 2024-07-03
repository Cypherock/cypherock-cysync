import type { Meta, StoryObj } from '@storybook/react';
import { LoadingCircle } from '../../components';

const meta: Meta<typeof LoadingCircle> = {
  component: LoadingCircle,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
