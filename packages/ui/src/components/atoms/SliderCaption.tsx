// SliderCaption.tsx

import React from 'react';

import { Flex } from './Flex';
import { Typography } from './Typography';
import { LangDisplay } from './LangDisplay';

interface Caption {
  id: number;
  name: string;
}

interface SliderCaptionProps {
  captions: Caption[];
}

export const SliderCaption: React.FC<SliderCaptionProps> = ({ captions }) => (
  <Flex justify="space-between" width="full">
    {captions.map(caption => (
      <Typography
        key={caption.id}
        variant="span"
        $fontSize={12}
        $fontWeight="medium"
        color="muted"
      >
        <LangDisplay text={caption.name} />
      </Typography>
    ))}
  </Flex>
);
