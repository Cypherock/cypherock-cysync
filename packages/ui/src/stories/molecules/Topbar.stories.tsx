import type { Meta, StoryObj } from '@storybook/react';

import { Topbar } from '../../components';

const meta: Meta<typeof Topbar> = {
  component: Topbar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    statusTexts: {
      connection: {
        connected: 'Connected',
        disconnected: 'Disconnected',
        error: 'Connection error!',
      },
      sync: {
        syncronized: 'Syncronized',
        syncronizing: 'Syncronizing...',
        error: 'Sync error!',
      },
    },
    haveNotifications: true,
    connectionStatus: 'connected',
    syncStatus: 'syncronized',
    isDiscreetMode: false,
    isLocked: false,
    isLockscreenLoading: false,
    isPasswordSet: true,
  },
};

export const InProcess: Story = {
  args: {
    ...Default.args,
    connectionStatus: 'disconnected',
    syncStatus: 'syncronizing',
  },
};

export const Failed: Story = {
  args: {
    ...Default.args,
    connectionStatus: 'error',
    syncStatus: 'error',
  },
};
