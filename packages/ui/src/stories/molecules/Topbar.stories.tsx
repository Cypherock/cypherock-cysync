import type { Meta, StoryObj, Decorator } from '@storybook/react';
import React from 'react';

import { Topbar } from '../../components';

const meta: Meta<typeof Topbar> = {
  component: Topbar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const withWidthDecorator: Decorator = Story => (
  <div style={{ width: '130%' }}>
    <Story />
  </div>
);

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
        synchronized: 'Synchronized',
        synchronizing: 'Synchronizing...',
        error: 'Sync error!',
      },
    },
    haveNotifications: true,
    connectionStatus: 'connected',
    syncStatus: 'synchronized',
    isDiscreetMode: false,
    isLocked: false,
    isLockscreenLoading: false,
    isPasswordSet: true,
    toggleDiscreetMode: () => '',
    onNotificationClick: () => '',
    onSyncClick: () => '',
  },
  decorators: [withWidthDecorator],
};

export const InProcess: Story = {
  args: {
    ...Default.args,
    connectionStatus: 'disconnected',
    syncStatus: 'synchronizing',
  },
  decorators: [withWidthDecorator],
};

export const Failed: Story = {
  args: {
    ...Default.args,
    connectionStatus: 'error',
    syncStatus: 'error',
  },
  decorators: [withWidthDecorator],
};
