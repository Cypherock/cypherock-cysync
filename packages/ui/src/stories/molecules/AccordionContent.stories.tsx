import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { AccordionContent } from '../../components';

const meta: Meta<typeof AccordionContent> = {
  component: AccordionContent,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    id: 'Accordion',
    items: [
      {
        component: <span>First</span>,
        width: 50,
        padding: 8,
        paddingLeft: '20',
      },
      {
        component: <span>Second</span>,
        width: 50,
        padding: 8,
        paddingLeft: '20',
      },
      {
        component: <span>Third</span>,
        width: 50,
        padding: 8,
        paddingLeft: '20',
      },
    ],
    headers: ['Head1', 'Head2', 'Head3'],
  },
};
