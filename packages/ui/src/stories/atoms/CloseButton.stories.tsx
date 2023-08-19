import type { Meta, StoryObj } from '@storybook/react';

import { CloseButton } from '../../components/atoms';

const meta: Meta<typeof CloseButton> = {
  component: CloseButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Button: Story = {};
