import type { Meta, StoryObj } from '@storybook/react';

import { SuccessDialog } from '../../../components';

const meta: Meta<typeof SuccessDialog> = {
  component: SuccessDialog,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'This is a title',
  },
};

export const Subtext: Story = {
  args: {
    ...Default.args,
    subtext: 'This is a subtext',
  },
};

export const Header: Story = {
  args: {
    ...Default.args,
    headerText: 'This is a header text',
  },
};

export const Button: Story = {
  args: {
    ...Default.args,
    buttonText: 'Button',
    handleClick: () => null,
  },
};

export const SecondaryButton: Story = {
  args: {
    ...Button.args,
    secondaryButtonText: 'Button',
    handleSecButtonClick: () => null,
  },
};

export const AlertText: Story = {
  args: {
    ...Default.args,
    alertText: 'This is a alert text',
  },
};
