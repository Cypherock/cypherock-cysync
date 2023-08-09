import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
} from '../../../components';

const meta: Meta<typeof DialogBox> = {
  component: DialogBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DialogBox>
      <DialogBoxHeader>Dialog Box Header</DialogBoxHeader>
      <DialogBoxBody>Dialog Box Body</DialogBoxBody>
      <DialogBoxFooter>Dialog Box Footer</DialogBoxFooter>
    </DialogBox>
  ),
};

export const Modal: Story = {
  args: {
    $isModal: true,
  },
  render: Default.render,
};
