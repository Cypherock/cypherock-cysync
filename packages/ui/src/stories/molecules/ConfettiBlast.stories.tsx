import type { Meta, StoryObj } from '@storybook/react';

import { ConfettiBlast } from '../../components';

const meta: Meta<typeof ConfettiBlast> = {
  component: ConfettiBlast,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
