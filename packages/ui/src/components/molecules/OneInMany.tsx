// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { Flex } from '../atoms/Flex';
import { oneInMany1, oneInMany2 } from '../../assets';
import { colors } from '../../themes/color.styled';

export interface OneInManyProps {
  title: string;
  description: string;
}

const StyledContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  border: ${({ isSelected }) =>
    isSelected ? `1px solid ${colors.border.selected}` : ''};
  background: ${colors.gradients.selected};
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 348px;
  height: 128px;
  color: ${colors.text.white};
  transition: background 0.5s ease, box-shadow 0.5s ease;

  &:before,
  &:after {
    color: ${colors.text.white};
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: initial;
    background-repeat: no-repeat;
    background-size: cover;
    transition: opacity 0.5s ease, transform 0.5s ease;
    backface-visibility: hidden;
    z-index: 0;
  }

  &:before {
    background-image: url(${oneInMany1});
    opacity: ${({ isSelected }) => (isSelected ? 0 : 1)};
    transform: ${({ isSelected }) =>
      isSelected ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  }

  &:after {
    background-image: url(${oneInMany2});
    opacity: ${({ isSelected }) => (isSelected ? 1 : 0)};
    transform: ${({ isSelected }) =>
      isSelected ? 'rotateY(0deg)' : 'rotateY(180deg)'};
    background-position: ${({ isSelected }) =>
      isSelected ? 'right' : 'right'};
  }

  ${({ isSelected }) =>
    !isSelected &&
    `
    &:hover {
      background: ${colors.gradients.oneInManyHover};
    background-position: right;
      &:before {
        opacity: 0;
        transform: rotateY(180deg);
      }
      &:after {
        opacity: 1;
        transform: rotateY(0deg);
      }
      ${StyledTitle} {
        position: relative;
        z-index: 3;
        background: ${colors.gradients.oneInManyTitle};
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
`;

const StyledDescription = styled.div`
  width: 148px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${colors.text.white};
  z-index: 3;
`;

export const OneInMany = ({ title, description }: OneInManyProps) => {
  const [isSelected, setisSelected] = useState(false);

  return (
    <StyledContainer
      isSelected={isSelected}
      onClick={() => setisSelected(!isSelected)}
      className="oneInManyContainer"
    >
      <Flex align="center" direction="row" justify="space-around" height="100%">
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </Flex>
    </StyledContainer>
  );
};

OneInMany.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
