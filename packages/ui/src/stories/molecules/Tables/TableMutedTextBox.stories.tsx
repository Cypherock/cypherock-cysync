import type { Meta, StoryObj } from '@storybook/react';

import { TableMutedTextBox } from '../../../components';

const meta: Meta<typeof TableMutedTextBox> = {
  component: TableMutedTextBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    text: 'Placeholder',
  },
};
