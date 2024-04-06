import type { Meta, StoryObj } from '@storybook/react';

import { RecipientAddress } from '../../../components';

const meta: Meta<typeof RecipientAddress> = {
  component: RecipientAddress,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
