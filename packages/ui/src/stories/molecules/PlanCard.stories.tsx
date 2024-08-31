import type { Meta, StoryObj } from '@storybook/react';

import { PlanCard } from '../../components';

const meta: Meta<typeof PlanCard> = {
  component: PlanCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SilverPlan: Story = {
  args: {
    type: 'silver',
    heading: 'Silver',
    description:
      'Secure your wallet PIN with us and easily recover it if forgotten, ensuring continuous access to your crypto assets.',
    features: [
      { text: 'No KYC required', available: true },
      { text: 'Multi-Chain', available: true },
      { text: 'PIN Recovery', available: true },
      { text: 'Estate Recovery', available: false },
    ],
    buttonText: 'SELECT',
  },
};

export const GoldPlan: Story = {
  args: {
    type: 'gold',
    heading: 'Gold',
    description:
      'Ensure your crypto assets are inherited by loved ones effortlessly, bypassing complex legal restrictions for smooth transfers.',
    features: [
      { text: 'No KYC required', available: true },
      { text: 'Multi-Chain', available: true },
      { text: 'PIN Recovery', available: true },
      { text: 'Estate Recovery', available: true },
    ],
    buttonText: 'SELECT',
    popularTagText: 'MOST POPULAR',
  },
};
