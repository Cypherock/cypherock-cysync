import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { FeesSlider } from '../../../components';

const meta: Meta<typeof FeesSlider> = {
  component: FeesSlider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <FeesSlider
        overrideDecimal={undefined}
        error={undefined}
        value={value}
        captions={[
          {
            id: 1,
            name: 'first',
          },
          {
            id: 2,
            name: 'second',
          },
        ]}
        average={2}
        onChange={setValue}
      />
    );
  },
};
