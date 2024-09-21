import type { Meta, StoryObj } from '@storybook/react';
import { TextAreaInput } from '../../components';

const meta: Meta<typeof TextAreaInput> = {
  component: TextAreaInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message',
  },
};

export const MaxChars: Story = {
  args: {
    placeholder: 'Enter your message',
    maxChars: 100,
    currentChars: 10,
  },
};
