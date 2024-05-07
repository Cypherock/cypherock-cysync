// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import {
  oneInManyBgImage,
  oneInManyBgHoverImage,
  oneInManyBgSelectedImage,
} from '../../assets';
import { Flex } from './Flex';

const Second = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: white !important;
`;

export interface OIMProps {
  description: string;
}

const Title = 'YES';

export const OneInMany: FC<OIMProps> = ({ description }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setisSelected] = useState(false);

  const StyledContainer = styled.div`
    &:hover {
      box-shadow: ${!isSelected
        ? '0px 0px 12px 4px #1B1813'
        : '0px 0px 12px 4px #1B1813 inset'};
      background-image: ${!isSelected
        ? `linear-gradient(105.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 60.65%), url(${oneInManyBgHoverImage}), linear-gradient(0deg, #332F2D, #332F2D)`
        : ''};
    }
    border: ${isSelected ? '1px solid #e0bb74' : ''};
    background: #2a2827;
    background: ${!isSelected
      ? `linear-gradient(285.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 60.65%), url(${oneInManyBgImage}), linear-gradient(0deg, #2A2827, #2A2827)`
      : `url(${oneInManyBgSelectedImage}), #2A2827`};
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;
    overflow: hidden;
    width: 348px;
    height: 128px;
    color: #ffffff;
  `;
  const First = styled.p`
  font-size: 64px;
  font-weight: 700;
  line-height: 96px;
  cursor: pointer;
  background: ${
    isHover && !isSelected
      ? 'linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%);'
      : ';'
  }
  -webkit-background-clip: ${isHover && !isSelected ? 'text' : 'inherit'};
  -webkit-text-fill-color: ${
    isHover && !isSelected ? 'transparent' : 'inherit'
  };
  
  `;
  return (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setisSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      className="oneInManyContainer"
    >
      <Flex>
        <First className={isHover ? 'hoverFirst' : ''}>{Title}</First>
        <Second>{description}</Second>
      </Flex>
    </StyledContainer>
  );
};
OneInMany.propTypes = {
  description: PropTypes.string.isRequired,
};
