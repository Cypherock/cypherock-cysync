import type { Meta, StoryObj } from '@storybook/react';

import { InfoAside } from '../../../components';

const meta: Meta<typeof InfoAside> = {
  component: InfoAside,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    subTitle: 'Subtitle',
    version: '1.0.0',
  },
};
