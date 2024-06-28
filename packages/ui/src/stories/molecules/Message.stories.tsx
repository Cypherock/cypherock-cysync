import type { Meta, StoryObj } from '@storybook/react';
import MessageBox from '../../components/molecules/MessageBox/Message';

const meta: Meta<typeof MessageBox> = {
  component: MessageBox,
  title: 'Components/MessageBox',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Card Location',
    placeholder: 'Provide Card location',
  },
};
