import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { DashIcon } from '../../../assets';
import { ProgressDialog } from '../../../components';

const meta: Meta<typeof ProgressDialog> = {
  component: ProgressDialog,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'This is a title',
    subtext: 'This is a subtext',
    icon: <DashIcon />,
    progress: 46,
  },
};

export const VersionText: Story = {
  args: {
    ...Default.args,
    versionText: 'This is a version text',
  },
};
