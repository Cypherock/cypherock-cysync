import type { Meta, StoryObj } from '@storybook/react';

import src from '../../assets/images/common/copy.png'
import { SnackBar } from '../../components';

const meta: Meta<typeof SnackBar> = {
  component: SnackBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story={
    args:{
       buttonName: 'Button',
       text: 'Sample Text',
       imageAlt: 'image_alt',
       imageSrc: src
    }
}