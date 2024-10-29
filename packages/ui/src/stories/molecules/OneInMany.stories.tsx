import type { Meta, StoryObj } from '@storybook/react';

import { OneInMany } from '../../components';

const meta: Meta<typeof OneInMany> = {
  component: OneInMany,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const StyleType1: Story = {
  args: {
    title: 'YES',
    description: 'Description goes here',
    $styleType: '1',
  },
};

export const StyleType2: Story = {
  args: {
    title: 'NO',
    description: 'Different description',
    $styleType: '2',
  },
};
