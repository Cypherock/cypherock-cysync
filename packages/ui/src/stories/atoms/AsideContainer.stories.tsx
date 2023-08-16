import type { Meta, StoryObj } from '@storybook/react';

import { AsideContainer } from '../../components/atoms';

const meta: Meta<typeof AsideContainer> = {
  component: AsideContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    $bgColor: 'primary',
  },
};
