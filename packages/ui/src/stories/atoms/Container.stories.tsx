import type { Meta, StoryObj } from '@storybook/react';

import { Container } from '../../components/atoms';

const meta: Meta<typeof Container> = {
  component: Container,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    $noFlex: false,
    size: 'lg',
    $bgColor: 'white',
    p: '10',
    children: 'This is the container ',
  },
};

export const FlexGapContainer: Story = {
  args: {
    ...Default.args,
    $noFlex: false,
    gap: 32,
  },
};

export const BatchContainer: Story = {
  args: {
    ...Default.args,
    p: '16',
    $borderRadius: 8,
    $width: '100%',
  },
};
