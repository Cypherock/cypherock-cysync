import type { Meta, StoryObj } from '@storybook/react';

import { MilestoneAside } from '../../../components';

const meta: Meta<typeof MilestoneAside> = {
  component: MilestoneAside,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeTab: 1,
    heading: 'Heading',
    milestones: ['Text 1', 'Text 2', 'Text 3'],
  },
};

export const Completed: Story = {
  args: {
    ...Default.args,
    activeTab: 3,
  },
};
