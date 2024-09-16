import type { Meta, StoryObj } from '@storybook/react';

import { TableNoData } from '../../../components';

const meta: Meta<typeof TableNoData> = {
  component: TableNoData,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    text: 'No Data',
    subText: 'Placeholder',
    buttonText: 'Button',
  },
};
