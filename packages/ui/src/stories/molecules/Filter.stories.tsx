import type { Meta, StoryObj } from '@storybook/react';

import { Filter } from '../../components';

const meta: Meta<typeof Filter> = {
  component: Filter,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    menu: 'Menu',
    isToggled: true,
    checkboxStates: [true, false],
    selectedCount: 0,
    subMenu: [
      {
        checkType: 'first',
        icon: '',
        name: 'First',
      },
      {
        checkType: 'Second',
        icon: '',
        name: 'Second',
      },
    ],
  },
};
