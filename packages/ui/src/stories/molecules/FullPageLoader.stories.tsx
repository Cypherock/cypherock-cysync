import type { Meta, StoryObj } from '@storybook/react';

import { FullPageLoader } from '../../components';

const meta: Meta<typeof FullPageLoader> = {
  component: FullPageLoader,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
