import type { Meta, StoryObj } from '@storybook/react';

import { InformationBox } from '../../components/atoms';

const meta: Meta<typeof InformationBox> = {
  component: InformationBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    $backgroundColor: undefined,
    $borderColor: undefined,
    rightImage: undefined,
    text: 'This is the info box',
  },
};
