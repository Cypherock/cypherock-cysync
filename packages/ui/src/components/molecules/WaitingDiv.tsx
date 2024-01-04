import React, { FC } from 'react';

import { Loading } from '../../assets';
import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  TypographyColor,
} from '../atoms';
import { BgColor, BorderColor } from '../utils';

export type WaitingDivType = 'info' | 'warning' | 'danger';
const borderColorMap: Record<WaitingDivType, BorderColor> = {
  info: 'input',
  warning: 'warning',
  danger: 'danger',
};
const bgColorMap: Record<WaitingDivType, BgColor> = {
  info: 'input',
  warning: 'warning',
  danger: 'error',
};
export const WaitingDiv: FC<{
  text: string;
  altText?: string;
  textColor?: TypographyColor;
  type: WaitingDivType;
  rightImage?: React.ReactNode;
  variables?: any;
}> = ({ text, altText, type, textColor, rightImage, variables }) => (
  <Container
    $borderColor={borderColorMap[type]}
    $bgColor={bgColorMap[type]}
    align="center"
    $borderRadius={8}
    gap={18}
    p={1}
    px={2}
    justify="flex-start"
    $alignSelf="stretch"
  >
    <div>
      <Loading />
    </div>
    <Flex direction="column" gap={4}>
      <Typography variant="fineprint" color={textColor ?? 'muted'}>
        <LangDisplay text={text} variables={variables} />
        {!altText && rightImage && rightImage}
      </Typography>
      {altText && (
        <Container align="center" gap={5}>
          <Typography variant="fineprint">
            <LangDisplay text={altText} variables={variables} />
          </Typography>
          {rightImage && rightImage}
        </Container>
      )}
    </Flex>
  </Container>
);

WaitingDiv.defaultProps = {
  rightImage: undefined,
  altText: undefined,
  textColor: undefined,
  variables: undefined,
};
