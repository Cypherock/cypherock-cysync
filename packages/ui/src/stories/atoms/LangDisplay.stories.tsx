import type { Meta, StoryObj } from '@storybook/react';

import { LangDisplay } from '../../components/atoms';

const meta: Meta<typeof LangDisplay> = {
  component: LangDisplay,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithVariable: Story = {
  args: {
    text: `This is a text with variable $\{variable}.`,
    variables: {
      variable: 'Cypherock',
    },
  },
};

export const WithoutVariable: Story = {
  args: {
    text: `This is a text without variable.`,
  },
};
