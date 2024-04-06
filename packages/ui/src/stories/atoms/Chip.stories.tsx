import type { StoryObj, Meta } from '@storybook/react';

import { Chip } from '../../components'; // Assuming your Chip component is in a file named Chip.tsx

const meta: Meta<typeof Chip> = {
  component: Chip,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Chip Box',
    p: 2,
  },
};
