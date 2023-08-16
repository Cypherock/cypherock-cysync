import type { Meta, StoryObj } from '@storybook/react';

import { Modal } from '../../components/atoms';

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 500,
    height: 300,
  },
};
