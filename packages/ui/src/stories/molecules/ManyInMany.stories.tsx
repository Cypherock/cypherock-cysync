import type { Meta, StoryObj } from '@storybook/react';

import { ManyInMany } from '../../components';

const meta: Meta<typeof ManyInMany> = {
  component: ManyInMany,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'DDDDDDDDDDDD',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    title: 'DDDDDDDDDDDD',
    disabled: true,
  },
};
