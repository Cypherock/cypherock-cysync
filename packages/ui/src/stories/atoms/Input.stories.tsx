import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Visibility } from '../../assets';
import { Input } from '../../components';

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter your text',
    name: 'text',
    label: 'Text Label',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
    name: 'email',
    label: 'Text Label',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    name: 'password',
    label: 'Text Label',
    postfixIcon: <Visibility />,
  },
};
