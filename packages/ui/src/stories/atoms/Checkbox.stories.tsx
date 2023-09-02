import type { Meta, StoryObj } from '@storybook/react';

import { CheckBox } from '../../components/atoms';

const meta: Meta<typeof CheckBox> = {
  component: CheckBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    checked: true,
    id: 'checkbox_item',
    label: 'Checkbox',
  },
};

export const Unchecked: Story = {
  args: {
    ...Checked.args,
    checked: false,
  },
};

export const Disabled: Story = {
  args: {
    ...Checked.args,
    checked: false,
  },
};
