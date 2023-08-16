import type { Meta, StoryObj } from '@storybook/react';

import { SelectContainer } from '../../components/atoms';

const meta: Meta<typeof SelectContainer> = {
  component: SelectContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
