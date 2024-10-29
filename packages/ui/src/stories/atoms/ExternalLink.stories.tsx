import type { Meta, StoryObj } from '@storybook/react';

import { ExternalLink } from '../../components';

const meta: Meta<typeof ExternalLink> = {
  component: ExternalLink,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'https://www.cypherock.com',
    text: 'Terms and Conditions',
    $width: 400,
  },
};
