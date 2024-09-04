import type { Meta, StoryObj } from '@storybook/react';

import { QuestionMarkButton } from '../../../components';

const meta: Meta<typeof QuestionMarkButton> = {
  component: QuestionMarkButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
