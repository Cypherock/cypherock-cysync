import type { Meta, StoryObj } from '@storybook/react';

import { Flex } from '../../components/atoms';

const meta: Meta<typeof Flex> = {
  component: Flex,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 300,
    height: 300,
    $bgColor: 'primary',
  },
};
