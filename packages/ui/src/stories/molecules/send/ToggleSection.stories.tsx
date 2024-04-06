import type { Meta, StoryObj } from '@storybook/react';

import { ToggleSection } from '../../../components';

const meta: Meta<typeof ToggleSection> = {
  component: ToggleSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Placeholder',
    value: true,
  },
};
