import type { Meta, StoryObj } from '@storybook/react';

import { SummaryBox } from '../../components/molecules';

const meta: Meta<typeof SummaryBox> = {
  component: SummaryBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    items: [
      {
        id: '1',
        isDivider: false,
        leftText: 'First Summary',
      },
      {
        id: '2',
        isDivider: true,
        leftText: 'Second Summary',
      },
      {
        id: '3',
        isDivider: true,
        leftText: 'Third Summary',
      },
    ],
  },
};
