import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LogoOutlinedAsideImage } from '../../../assets';
import { OnboardingLayout } from '../../../components';

const meta: Meta<typeof OnboardingLayout> = {
  component: OnboardingLayout,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    img: LogoOutlinedAsideImage,
    currentState: 2,
    totalState: 5,
    version: '1.0.0',
    title: 'Title',
    subTitle: 'SubTitle',
    showAside: true,
    children: <div style={{ width: '30rem' }}>Children</div>,
  },
};
