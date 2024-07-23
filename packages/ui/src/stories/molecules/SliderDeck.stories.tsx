import type { Meta, StoryObj } from '@storybook/react';

import { SliderDeck } from '../../components';

const meta: Meta<typeof SliderDeck> = {
  component: SliderDeck,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SliderDeck>;

export const Default: Story = {
  args: {
    selectedYear: 1,
  },
};

export const TwoYears: Story = {
  args: {
    selectedYear: 2,
  },
};

export const ThreeYears: Story = {
  args: {
    selectedYear: 3,
  },
};

export const FourYears: Story = {
  args: {
    selectedYear: 4,
  },
};

export const FiveYears: Story = {
  args: {
    selectedYear: 5,
  },
};
