import type { Meta, StoryObj } from '@storybook/react';

import { ErrorDialog } from '../../../components';

const meta: Meta<typeof ErrorDialog> = {
  component: ErrorDialog,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'This is a title',
    subtext: 'This is a subtext',
    primaryActionText: 'Primary Action Text',
    secondaryActionText: 'Secondary Action Text',
    iconType: 'default',
  },
};

export const Device: Story = {
  args: {
    ...Default.args,
    iconType: 'device',
  },
};

export const Server: Story = {
  args: {
    ...Default.args,
    iconType: 'server',
  },
};
