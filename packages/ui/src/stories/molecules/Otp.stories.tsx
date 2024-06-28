import type { Meta, StoryObj } from '@storybook/react';

import OTP from '../../components/molecules/OtpSection/Otp';

const meta: Meta<typeof OTP> = {
  component: OTP,
  title: 'Components/OTP',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    status: 'idle',
    heading: 'Enter OTP',
    email: 'john@gmail.com',
  },
};

export const Success: Story = {
  args: {
    status: 'success',
    heading: 'Please wait while we redirect you...',
    email: 'john@gmail.com',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    heading: 'Wrong OTP',
    email: 'john@gmail.com',
  },
};
