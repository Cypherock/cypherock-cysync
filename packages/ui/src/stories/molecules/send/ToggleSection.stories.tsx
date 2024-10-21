import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { ToggleSection } from '../../../components';

const meta: Meta<typeof ToggleSection> = {
  component: ToggleSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [toggleValue, setToggleValue] = useState(true);

    return (
      <ToggleSection
        text="Placeholder"
        value={toggleValue}
        onChange={setToggleValue}
      />
    );
  },
};
