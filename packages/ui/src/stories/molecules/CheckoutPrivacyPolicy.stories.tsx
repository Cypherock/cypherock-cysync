import type { Meta, StoryObj } from '@storybook/react';
import { CheckoutPrivacyPolicy } from '../../components';

const meta: Meta<typeof CheckoutPrivacyPolicy> = {
  component: CheckoutPrivacyPolicy,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {},
};
