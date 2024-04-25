import type { Meta, StoryObj } from '@storybook/react';

import { FeesSlider } from '../../../components';

const meta: Meta<typeof FeesSlider> = {
  component: FeesSlider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;
let value = 2;
export const Default: Story = {
  args: {
    overrideDecimal: undefined,
    error: undefined,
    value,
    captions: [
      {
        id: 1,
        name: 'first',
      },
      {
        id: 2,
        name: 'second',
      },
    ],
    average: value,
    onChange: newValue => {
      value = newValue;
    },
  },
};
