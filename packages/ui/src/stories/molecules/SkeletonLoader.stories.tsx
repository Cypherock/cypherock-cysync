import type { Meta, StoryObj } from '@storybook/react';

import { SkeletonLoader } from '../../components';

const meta: Meta<typeof SkeletonLoader> = {
  component: SkeletonLoader,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    text: 'Placeholder',
    subText: 'SubText',
    subText2: 'SubText 2',
    $buttonOne: 'First',
    $buttonTwo: 'Second',
  },
};
