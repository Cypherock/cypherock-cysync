import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ListContainer, ListItem } from '../../components/atoms';

const meta: Meta<typeof ListContainer> = {
  component: ListContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const listItems = [
  'This is list item 1',
  'This is list item 2',
  'This is list item 3',
  'This is list item 4',
  'This is list item 5',
];

export const Default: Story = {
  args: {
    direction: 'column',
    children: (
      <>
        {listItems.map((item, index) => (
          <ListItem key={`list-item-${index + 1}`}>{item}</ListItem>
        ))}
      </>
    ),
  },
};
