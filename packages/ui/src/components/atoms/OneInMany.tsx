// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { oneInManyFirst, oneInManySecond, oneInManyThird } from '../../assets';

const Flex = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex-direction: row;
  justify-content: space-evenly;
  font-family: Poppins;
`;

const Second = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: white !important;
`;

export interface OIMProps {
  description: string;
}

export const OneInMany: FC<OIMProps> = ({ description }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setisSelected] = useState(false);

  const StyledContainer = styled.div`
    &:hover {
      box-shadow: ${!isSelected
        ? '0px 0px 12px 4px #1B1813'
        : '0px 0px 12px 4px #1B1813 inset'};
      background-image: ${!isSelected
        ? `linear-gradient(105.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 60.65%), url(${oneInManySecond}), linear-gradient(0deg, #332F2D, #332F2D)`
        : ''};
    }
    border: ${isSelected ? '1px solid #e0bb74' : ''};
    background: #2a2827;
    background: ${!isSelected
      ? `linear-gradient(285.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 60.65%), url(${oneInManyFirst}), linear-gradient(0deg, #2A2827, #2A2827)`
      : `url(${oneInManyThird}), #2A2827`};
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
      onMouseDown={() => setisSelected(true)}
      onMouseUp={() => setisSelected(false)}
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="oneInManyContainer"
    >
      <Flex>
        <First className={isHover ? 'hoverFirst' : ''}>YES</First>
        <Second>{description}</Second>
      </Flex>
    </StyledContainer>
  );
};
OneInMany.propTypes = {
  description: PropTypes.string.isRequired,
};
