import type { Meta, StoryObj } from '@storybook/react';

import { EmailDisplay } from '../../../components';

const meta: Meta<typeof EmailDisplay> = {
  component: EmailDisplay,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    email: 'testemail@cypherock.com',
  },
};
