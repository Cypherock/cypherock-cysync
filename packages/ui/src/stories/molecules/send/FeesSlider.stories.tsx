import type { Meta, StoryObj } from '@storybook/react';

import { FeesSlider } from '../../../components';

const meta: Meta<typeof FeesSlider> = {
  component: FeesSlider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    overrideDecimal: undefined,
    error: undefined,
    value: 2,
    captions: [],
  },
};
