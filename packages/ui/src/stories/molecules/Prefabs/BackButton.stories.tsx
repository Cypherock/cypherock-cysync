import type { Meta, StoryObj } from '@storybook/react';

import { BackButton } from '../../../components';

const meta: Meta<typeof BackButton> = {
  component: BackButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Back',
  },
};
