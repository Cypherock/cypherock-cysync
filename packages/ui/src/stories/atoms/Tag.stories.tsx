import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from '../../components/atoms';

const meta: Meta<typeof Tag> = {
  component: Tag,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
