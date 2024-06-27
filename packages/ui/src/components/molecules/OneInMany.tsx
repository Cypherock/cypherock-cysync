// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { Flex } from '../atoms/Flex';

import { Onetomany1, Onetomany2, Onetomany3 } from '../../assets';

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
  border: ${({ isSelected }) => (isSelected ? '1px solid #e0bb74' : '')};
  background: ${({ isSelected }) =>
    !isSelected
      ? `linear-gradient(285.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 60.65%), url(${Onetomany1}), linear-gradient(0deg, #2A2827, #2A2827)`
      : `url(${Onetomany3}), #2A2827`};
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 348px;
  height: 128px;
  color: #ffffff;

  &:hover {
    box-shadow: ${({ isSelected }) =>
      !isSelected
        ? '0px 0px 12px 4px #1B1813'
        : '0px 0px 12px 4px #1B1813 inset'};
    background-image: ${({ isSelected }) =>
      !isSelected
        ? `linear-gradient(105.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 60.65%), url(${Onetomany2}), linear-gradient(0deg, #332F2D, #332F2D)`
        : ''};
    .title {
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
`;

const firstStyle = {
  fontSize: '64px',
  fontWeight: 700,
  lineHeight: '96px',
};

export const OneInMany: FC<OIMProps> = ({ title, description }) => {
  const [isSelected, setisSelected] = useState(false);

  return (
    <StyledContainer
      isSelected={isSelected}
      onClick={() => setisSelected(!isSelected)}
      className="oneInManyContainer"
    >
      <Flex align="center" direction="row" justify="space-around" height="100%">
        <div className="title" style={firstStyle}>
          {' '}
          {title}{' '}
        </div>
        <div style={Second}>{description}</div>
      </Flex>
    </StyledContainer>
  );
};

OneInMany.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
