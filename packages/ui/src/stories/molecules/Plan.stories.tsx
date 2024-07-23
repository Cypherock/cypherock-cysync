import type { Meta, StoryObj } from '@storybook/react';

import { Plan } from '../../components';

const meta: Meta<typeof Plan> = {
  component: Plan,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SilverPlan: Story = {
  args: {
    planType: 'silver',
    heading: 'Silver',
    tagline: 'PIN Recovery',
    description:
      'Secure your wallet PIN with us and easily recover it if forgotten, ensuring continuous access to your crypto assets.',
    price: '$25',
    features: [
      { text: 'No KYC required', available: true },
      { text: 'Multi-Chain', available: true },
      { text: 'PIN Recovery', available: true },
      { text: 'Estate Recovery', available: false },
    ],
  },
};

export const GoldPlan: Story = {
  args: {
    planType: 'gold',
    heading: 'Gold',
    tagline: 'Non-Custodial Estate Recovery',
    description:
      'Ensure your crypto assets are inherited by loved ones effortlessly, bypassing complex legal restrictions for smooth transfers.',
    price: '$100',
    features: [
      { text: 'No KYC required', available: true },
      { text: 'Multi-Chain', available: true },
      { text: 'PIN Recovery', available: true },
      { text: 'Estate Recovery', available: true },
    ],
  },
};
