import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Check, CloudDownload } from '../../assets';
import { UpdateBar } from '../../components';
import { getDefaultTheme } from '../../themes';

const meta: Meta<typeof UpdateBar> = {
  component: UpdateBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const theme = getDefaultTheme();

export const Confirmation: Story = {
  args: {
    icon: <CloudDownload />,
    text: 'Update to cySync version 1.0.0 is available',
    state: 'normal',
    buttonText: 'Download',
  },
};

export const Downloading: Story = {
  args: {
    icon: <CloudDownload />,
    text: 'Downloading cySync version 1.0.0',
    state: 'progress',
    progress: 46,
  },
};

export const Downloaded: Story = {
  args: {
    icon: <Check />,
    text: 'cySync update version 1.0.0 downloaded',
    buttonText: 'Install Update',
    state: 'success',
  },
};

export const Failed: Story = {
  args: {
    icon: <CloudDownload fill={theme.palette.warn.main} />,
    text: 'Error downloading cySync update',
    buttonText: 'Try Again',
    state: 'error',
  },
};
export const FailedFallback: Story = {
  args: {
    icon: <CloudDownload fill={theme.palette.warn.main} />,
    text: 'Error downloading cySync update',
    buttonText: 'Try Again',
    state: 'error',
  },
};
