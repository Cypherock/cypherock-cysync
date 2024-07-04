import type { Meta, StoryObj } from '@storybook/react';

import { SnackBar } from '../../components';

const meta: Meta<typeof SnackBar> = {
  component: SnackBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttonText: 'Button',
    text: 'Sample Text',
    icon: 'check',
  },
};
