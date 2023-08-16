import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ArrowRightIcon, Check } from '../../assets';
import { LeanBox } from '../../components';

const meta: Meta<typeof LeanBox> = {
  component: LeanBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'This is a message',
  },
};

export const CheckBox: Story = {
  args: {
    ...Default.args,
    checkType: 'checkbox',
  },
};

export const RadioButton: Story = {
  args: {
    ...Default.args,
    checkType: 'radio',
  },
};

export const RightText: Story = {
  args: {
    ...Default.args,
    rightText: 'This is a right text',
  },
};

export const Tag: Story = {
  args: {
    ...Default.args,
    tag: 'This is a tag',
  },
};

export const LeftImage: Story = {
  args: {
    ...Default.args,
    leftImage: <ArrowRightIcon />,
  },
};

export const RightImage: Story = {
  args: {
    ...Default.args,
    rightImage: <Check width={15} height={12} />,
  },
};

export const ShortForm: Story = {
  args: {
    ...Default.args,
    shortForm: 'Short Form',
  },
};
