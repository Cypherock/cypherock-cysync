import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Slider } from '../../components';

const meta: Meta<typeof Slider> = {
  component: Slider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => {
    const [value, setValue] = useState(50);

    return (
      <Slider
        value={value}
        min={0}
        max={100}
        decimal={0}
        onChange={setValue}
        captions={[
          {
            id: 1,
            name: 'First',
          },
          {
            id: 2,
            name: 'Second',
          },
        ]}
      />
    );
  },
};
