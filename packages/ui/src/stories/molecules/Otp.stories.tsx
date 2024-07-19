import type { Meta, StoryObj } from '@storybook/react';

import { OTP } from '../../components/molecules';

const meta: Meta<typeof OTP> = {
  component: OTP,
  title: 'Components/OTP',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    stateOfOtp: 'idle',
    headerText: 'Enter OTP',
    email: 'john@gmail.com',
    lowerContainerText: {
      infoText1: 'An email has been sent to',
      infoText2: 'Please check your email for the OTP.',
    },
  },
};

export const Success: Story = {
  args: {
    stateOfOtp: 'success',
    headerText: 'Please wait while we redirect you...',
    email: 'john@gmail.com',
    lowerContainerText: {
      infoText1: 'An email has been sent to',
      infoText2: 'Please check your email for the OTP.',
    },
  },
};

export const Error: Story = {
  args: {
    stateOfOtp: 'error',
    headerText: 'Wrong OTP',
    email: 'john@gmail.com',
    lowerContainerText: {
      infoText1: 'An email has been sent to',
      infoText2: 'Please check your email for the OTP.',
    },
    errorContainerText: {
      errorHeading: 'You have 0 retries remaining',
      errorText: 'Please exit the flow and restart',
    },
  },
};
