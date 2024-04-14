import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from '../../components/atoms';

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Gold: Story = {
  args: {
    header: 'What is reminder time?',
    detail:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime fuga magnam iure assumenda eligendi animi architecto facere quas dignissimos odio doloremque sapiente tenetur, totam temporibus. Accusantium ad a praesentium corporis mollitia magni dignissimos. Eos ut a exercitationem consequatur quod. Enim assumenda impedit maiores dolores nam doloremque eveniet quas quis culpa?',
  },
};
