import type { Meta, StoryObj } from '@storybook/react';

import { LeanBoxContainer } from '../../components/atoms';

const meta: Meta<typeof LeanBoxContainer> = {
  component: LeanBoxContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
