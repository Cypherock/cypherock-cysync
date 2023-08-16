import type { Meta, StoryObj } from '@storybook/react';

import { confirmAlphabeticDeviceImage } from '../../assets';
import { Image } from '../../components/atoms';

const meta: Meta<typeof Image> = {
  component: Image,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: confirmAlphabeticDeviceImage,
  },
};
