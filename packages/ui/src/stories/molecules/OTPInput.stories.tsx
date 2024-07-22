/* eslint-disable no-template-curly-in-string */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { OTPInput } from '../../components/molecules';

const meta: Meta<typeof OTPInput> = {
  component: OTPInput,
  render: args => {
    const [value, onChange] = React.useState('');

    return <OTPInput {...args} value={value} onChange={onChange} />;
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    title: 'Enter OTP',
    status: 'idle',
    otpLength: 6,
    subText: '4 tries remaining 25..',
    infoText: [
      'An email has been sent to **${email}**',
      'Please check your email for the OTP.',
    ],
    textVariables: {
      email: 'john@gmail.com',
    },
  },
};

export const Error: Story = {
  args: {
    title: 'Wrong OTP',
    status: 'error',
    otpLength: 6,
    subText: '3 tries remaining 25..',
    infoText: [
      'An email has been sent to **${email}**',
      'Please check your email for the OTP.',
    ],
    textVariables: {
      email: 'john@gmail.com',
    },
  },
};

export const Success: Story = {
  args: {
    title: 'Please wait while we redirect you...',
    status: 'success',
    otpLength: 6,
    disabled: true,
    subText: '3 tries remaining 25..',
    infoText: [
      'An email has been sent to **${email}**',
      'Please check your email for the OTP.',
    ],
    textVariables: {
      email: 'john@gmail.com',
    },
  },
};

export const RetryExceeded: Story = {
  args: {
    title: 'You have 0 retries remaining',
    status: 'retryExceeded',
    errorSubText: 'Please exit the flow and restart',
    otpLength: 6,
    disabled: true,
    subText: '3 tries remaining 25..',
    infoText: [
      'An email has been sent to **${email}**',
      'Please check your email for the OTP.',
    ],
    textVariables: {
      email: 'john@gmail.com',
    },
  },
};
