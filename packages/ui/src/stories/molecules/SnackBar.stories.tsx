import type { Meta, StoryObj } from '@storybook/react';

import { SnackBar } from '../../components/molecules';

const meta: Meta<typeof SnackBar> = {
  component: SnackBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    icon: 'check',
    buttonText: 'Placeholder Text',
    text: 'String',
  },
};
