import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { FailIcon } from '../../../assets';
import { IconDialogBox } from '../../../components';

const meta: Meta<typeof IconDialogBox> = {
  component: IconDialogBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'This is a title',
    subtext: 'This is a subtext',
    icon: <FailIcon />,
  },
};

export const AfterText: Story = {
  args: {
    ...Default.args,
    afterTextComponent: 'After Text',
  },
};

export const Footer: Story = {
  args: {
    ...Default.args,
    footerComponent: 'This is a footer',
  },
};
