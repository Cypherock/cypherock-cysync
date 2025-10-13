import type { Meta, StoryObj } from '@storybook/react';

import { OnboardingLayout } from '../../components';

const meta: Meta<typeof OnboardingLayout> = {
  component: OnboardingLayout,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Placeholder',
    title: 'title',
    subTitle: 'subtitle',
  },
};
