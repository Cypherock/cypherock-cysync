// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { Flex } from '../atoms/Flex';
import { oneInMany1, oneInMany2 } from '../../assets';

const Second = {
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '18px',
  color: 'white',
};

export interface OIMProps {
  title: string;
  description: string;
}

const StyledContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  border: ${({ isSelected }) => (isSelected ? '1px solid #e0bb74' : '')};
  background: ${({ isSelected }) =>
    isSelected
      ? 'linear-gradient(0deg, #2A2827, #2A2827)'
      : 'linear-gradient(0deg, #2A2827, #2A2827)'};
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 348px;
  height: 128px;
  color: #ffffff;
  transition: background 0.5s ease, box-shadow 0.5s ease;

  &:before,
  &:after {
    color: #ffffff;
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
      background: linear-gradient(0deg, #332F2D, #332F2D);
    background-position: right;
      &:before {
        opacity: 0;
        transform: rotateY(180deg);
      }
      &:after {
        opacity: 1;
        transform: rotateY(0deg);
      }
      .title {
        position: relative;
        z-index: 3;
        background: linear-gradient(
          90deg,
          #e9b873 0.19%,
          #fedd8f 37.17%,
          #b78d51 100.19%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    `}
  .title {
    z-index: 3;
  }
  .description {
    z-index: 3;
  }
`;

const firstStyle = {
  fontSize: '64px',
  fontWeight: 700,
  lineHeight: '96px',
};

export const OneInMany = ({ title, description }: OIMProps) => {
  const [isSelected, setisSelected] = useState(false);

  return (
    <StyledContainer
      isSelected={isSelected}
      onClick={() => setisSelected(!isSelected)}
      className="oneInManyContainer"
    >
      <Flex align="center" direction="row" justify="space-around" height="100%">
        <div className="title" style={firstStyle}>
          {title}
        </div>
        <div style={Second} className="description">
          {description}
        </div>
      </Flex>
    </StyledContainer>
  );
};

OneInMany.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
