import type { Meta, StoryObj } from '@storybook/react';

import { CopyContainer } from '../../components';

const meta: Meta<typeof CopyContainer> = {
  component: CopyContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    link: 'https://cypherock.com',
  },
};
