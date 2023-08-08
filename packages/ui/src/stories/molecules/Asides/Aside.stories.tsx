import type { Meta, StoryObj } from '@storybook/react';

import { LogoOutlinedAsideImage } from '../../../assets';
import { Aside } from '../../../components';

const meta: Meta<typeof Aside> = {
  component: Aside,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentState: 3,
    totalState: 6,
    img: LogoOutlinedAsideImage,
    text: 'Aside Text',
  },
};
