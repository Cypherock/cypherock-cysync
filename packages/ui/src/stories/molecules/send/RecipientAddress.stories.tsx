import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { RecipientAddress } from '../../../components';

const meta: Meta<typeof RecipientAddress> = {
  component: RecipientAddress,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [address, setAddress] = useState('Bangalore, Karnataka');
    return (
      <RecipientAddress value={address} onChange={setAddress} placeholder="" />
    );
  },
};
