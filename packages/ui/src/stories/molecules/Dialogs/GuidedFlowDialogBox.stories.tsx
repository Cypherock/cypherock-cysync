import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { confirmAlphabeticDeviceImage } from '../../../assets';
import { Button, GuidedFlowDialogBox } from '../../../components';
import * as BulletListStories from '../BulletList.stories';
import * as GoldenArrowListStories from '../GoldenArrowList.stories';
import * as MessageBoxStories from '../MessageBox.stories';

const meta: Meta<typeof GuidedFlowDialogBox> = {
  component: GuidedFlowDialogBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'This is a heading',
    title: 'This is a title',
    image: confirmAlphabeticDeviceImage,
  },
};

export const Subtitle: Story = {
  args: {
    ...Default.args,
    subtitle: 'This is a subtitle',
  },
};

export const DisalbedArrows: Story = {
  args: {
    ...Default.args,
    disableNext: true,
    disablePrev: true,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    loadingText: 'Loading...',
  },
};

export const CustomFooter: Story = {
  args: {
    ...Default.args,
    footer: <Button variant="primary">Primary</Button>,
  },
};

export const BulletList: Story = {
  args: {
    ...Default.args,
    bulletList: BulletListStories.Default.args?.items,
  },
};

export const GoldenArrowList: Story = {
  args: {
    ...Default.args,
    goldenArrowList: GoldenArrowListStories.Default.args?.items,
  },
};

export const MessageBoxList: Story = {
  args: {
    ...Default.args,
    messageBoxList: [
      {
        info: MessageBoxStories.Info.args?.text ?? 'Info Text',
        warning: MessageBoxStories.Warning.args?.text ?? 'Warning Text',
        danger: 'Danger Text',
      },
      {
        warning: MessageBoxStories.Warning.args?.text ?? 'Warning Text',
        info: MessageBoxStories.Info.args?.text ?? 'Info Text',
        danger: 'Danger Text',
      },
    ],
  },
};
