import type { Meta, StoryObj } from '@storybook/react';

import { HelpButton } from '../../../components';

const meta: Meta<typeof HelpButton> = {
  component: HelpButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Help',
  },
};
