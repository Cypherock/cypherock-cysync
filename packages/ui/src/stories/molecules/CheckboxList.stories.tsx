import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxList } from '../../components';

const meta: Meta<typeof CheckboxList> = {
  component: CheckboxList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    items: [
      {
        label: 'Checkbox Item 1',
        checked: false,
        id: 'checkbox_item_1',
      },
      {
        label: 'Checkbox Item 2',
        checked: false,
        id: 'checkbox_item_2',
      },
      {
        label: 'Checkbox Item 3',
        checked: false,
        id: 'checkbox_item_3',
      },
      {
        label: 'Checkbox Item 4',
        checked: false,
        id: 'checkbox_item_4',
      },
      {
        label: 'Checkbox Item 5',
        checked: false,
        id: 'checkbox_item_5',
      },
    ],
  },
};

export const Checked: Story = {
  args: {
    items: [
      {
        label: 'Checkbox Item 1',
        checked: true,
        id: 'checkbox_item_1',
      },
      {
        label: 'Checkbox Item 2',
        checked: true,
        id: 'checkbox_item_2',
      },
      {
        label: 'Checkbox Item 3',
        checked: true,
        id: 'checkbox_item_3',
      },
      {
        label: 'Checkbox Item 4',
        checked: false,
        id: 'checkbox_item_4',
      },
      {
        label: 'Checkbox Item 5',
        checked: false,
        id: 'checkbox_item_5',
      },
    ],
  },
};
