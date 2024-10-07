// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from 'styled-components';

import {
  oneInMany1Default,
  oneInMany1Hover,
  oneInMany2Default,
  oneInMany2Hover,
} from '../../assets';
import { ThemeType } from '../../themes';
import { Flex } from '../atoms';
import { WidthProps, width } from '../utils';

export type OneInManyStyleType = '1' | '2';

interface OneInManyStyledContainerProps extends WidthProps {
  $styleType: OneInManyStyleType;
}
export interface OneInManyProps extends OneInManyStyledContainerProps {
  title: string;
  description: string;
  onClick?: () => void;
  isSelected?: boolean;
  $styleType: OneInManyStyleType;
}

interface BgStyleProps {
  isSelected: boolean;
  theme: ThemeType;
}

const getBgStyle1 = ({ isSelected, theme }: BgStyleProps) => `
  &:before,
  &:after {
    color: ${theme.palette.text.white};
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: initial;
    background-repeat: no-repeat;
    backface-visibility: hidden;
    z-index: 0;
    transition: opacity 0.5s ease-in-out;
    background-position: right;
    animation: rotateBounceOut 0.5s ease-in-out forwards;
    ${isSelected && `animation: rotateBounceIn 0.5s ease-in-out forwards;`}
  }

  &:before {
    background-image: url(${oneInMany1Default});
    opacity: 1;
  }

  &:after {
    background-image: url(${oneInMany1Hover});
    opacity: 0;
  }

  ${
    !isSelected &&
    `
    &:hover:before {
      animation: rotateBounceIn 0.5s ease-in-out forwards;
      opacity: 0;
    }

    &:hover:after {
      animation: rotateBounceIn 0.5s ease-in-out forwards;
      opacity: 1;
    }
    `
  }

  @keyframes rotateBounceIn {
    0% {
      transform: rotateZ(0deg);
    }
    10% {
      transform: rotateZ(10deg);
    }
    20% {
      transform: rotateZ(10deg);
    }
    80% {
      transform: rotateZ(-190deg);
    }
    90% {
      transform: rotateZ(-190deg);
    }
    100% {
      transform: rotateZ(-180deg);
    }
  }

  @keyframes rotateBounceOut {
    0% {
      transform: rotateZ(-180deg);
    }
    10% {
      transform: rotateZ(-190deg);
    }
    20% {
      transform: rotateZ(-190deg);
    }
    80% {
      transform: rotateZ(10deg);
    }
    90% {
      transform: rotateZ(10deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }
`;

const getBgStyle2 = ({ isSelected, theme }: BgStyleProps) => `
  &:before,
  &:after {
    color: ${theme.palette.text.white};
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: initial;
    background-repeat: no-repeat;
    transition: opacity 0.5s ease, transform 0.5s ease;
    backface-visibility: hidden;
    z-index: 0;
  }

  &:before {
    background-image: url(${oneInMany2Default});
    opacity: ${isSelected ? 0 : 1};
    transform: ${isSelected ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  }

  &:after {
    background-image: url(${oneInMany2Hover});
    opacity: ${isSelected ? 1 : 0};
    transform: ${isSelected ? 'rotateY(0deg)' : 'rotateY(180deg)'};
    background-position: initial;
  }

  ${
    !isSelected &&
    `
    &:hover:before {
      opacity: 0;
      transform: rotateY(180deg);
    }
    &:hover:after {
      opacity: 1;
      transform: rotateY(0deg);
    }
    `
  }
`;

const getBgStyleMap: Record<
  OneInManyStyleType,
  (props: BgStyleProps) => string
> = {
  '1': getBgStyle1,
  '2': getBgStyle2,
};

const StyledContainer = styled.div<
  OneInManyStyledContainerProps & { $isSelected: boolean }
>`
  position: relative;
  border: 1px solid
    ${({ $isSelected, theme }) =>
      $isSelected ? `${theme.palette.border.selected}` : 'transparent'};
  box-shadow: ${({ $isSelected }) =>
    $isSelected ? '0px 0px 12px 4px #1B1813 inset' : ''};
  background: ${({ theme }) => theme.palette.gradients.cardSelected};
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 348px;
  height: 128px;
  color: ${({ theme }) => theme.palette.text.white};
  transition: background 0.5s ease, box-shadow 0.5s ease;

  ${width}

  ${({ $styleType, $isSelected, theme }) =>
    getBgStyleMap[$styleType]({ $isSelected, theme } as any)}

  ${({ $isSelected, theme }) =>
    !$isSelected &&
    `
    &:hover {
      background: ${theme.palette.gradients.cardHover};
      background-position: right;

      ${StyledTitle} {
        position: relative;
        z-index: 3;
        background: ${theme.palette.gradients.title};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    `}
`;

const StyledTitle = styled.div`
  font-size: 64px;
  font-weight: 700;
  line-height: 96px;
  z-index: 3;
  width: 120px;
`;

const StyledDescription = styled.div`
  width: 148px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.palette.text.white};
  z-index: 3;
  text-align: end;
  margin-left: 16px;
`;

export const OneInMany: React.FC<OneInManyProps> = ({
  title,
  description,
  $styleType,
  onClick,
  isSelected,
  ...restProps
}) => (
  <StyledContainer
    $isSelected={isSelected ?? false}
    $styleType={$styleType}
    onClick={onClick}
    {...(restProps as Partial<OneInManyStyledContainerProps>)}
  >
    <Flex align="center" direction="row" height="100%" mx="32px">
      <StyledTitle>{title}</StyledTitle>
      <StyledDescription>{description}</StyledDescription>
    </Flex>
  </StyledContainer>
);

OneInMany.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  $styleType: PropTypes.oneOf<OneInManyStyleType>(['1', '2']).isRequired,
};

OneInMany.defaultProps = {
  onClick: undefined,
  isSelected: false,
};
