import React, { FC, useState, CSSProperties } from 'react';
import { styled } from 'styled-components';
import { Flex } from '../atoms/Flex';

import {
  mimDefault,
  mimDefaultBg,
  mimDefaultWallet,
  mimDisableWallet,
  mimHovertWallet,
  redInfo,
} from '../../assets';

const disableContainerStyle: CSSProperties = {
  position: 'relative',
  background: '#282522',
  overflow: 'hidden',
  borderRadius: '8px',
  width: '276px',
  height: '128px',
  padding: '24px 16px 24px 16px',
  color: '#39322c',
};

const dateLabelStyle: CSSProperties = {
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '21px',
  textAlign: 'center',
  zIndex: 1,
};

const WalletDefaultImage = styled.img.attrs({
  src: mimDefaultWallet,
  alt: 'wallet',
})`
  zindex: 1;
`;

const WalletHoverImage = styled.img.attrs({
  src: mimHovertWallet,
  alt: 'wallet hover',
})`
  zindex: 1;
`;

const WalletDisableImage = styled.img.attrs({
  src: mimDisableWallet,
  alt: 'wallet hover',
})``;

const StyledRedInfoImage = styled.img.attrs({
  src: redInfo,
  alt: 'Info',
})`
  position: absolute;
  right: 10px;
  top: 10px;
`;

export interface ManyInManyProps {
  title: string;
  disabled: boolean;
}

const StyledContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  overflow: hidden;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: #ffffff;
  cursor: pointer;
  border-radius: 8px;
  border: ${({ isSelected }) => (isSelected ? '1px solid #e0bb74' : 'none')};
  box-shadow: ${({ isSelected }) =>
    !isSelected
      ? '0px 0px 12px 4px #1B1813'
      : '0px 0px 12px 4px #1B1813 inset'};
  background: ${({ isSelected }) =>
    !isSelected
      ? `linear-gradient(300deg, rgba(96, 58, 23, 0.20) 0%, rgba(0, 0, 0, 0.00) 57.81%, rgba(0, 0, 0, 0.00) 100%), #2A2827`
      : `#2A2827`};
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    background-image: url(${({ isSelected }) =>
      !isSelected ? mimDefault : 'none'});
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: 450px;
    transition: transform 0.4s ease-in-out;
    transform-origin: bottom center;
  }
  &:hover::after {
    transform: ${({ isSelected }) =>
      !isSelected ? 'translateX(-30%) rotate(45deg) scale(1.5)' : 'none'};
    background-position: bottom left;
    background-image: url(${({ isSelected }) =>
      !isSelected ? mimDefaultBg : 'none'});
  }
  &:hover {
    background: ${({ isSelected }) =>
      !isSelected
        ? `linear-gradient(120deg, rgba(96, 58, 23, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), #332F2D`
        : 'linear-gradient(300deg, rgba(96, 58, 23, 0.20) 0%, rgba(0, 0, 0, 0.00) 57.81%, rgba(0, 0, 0, 0.00) 100%), #2A2827'};
    box-shadow: 0px 4px 12px 4px #1b1813;
  }
  position: relative;
  z-index: 1;
`;

export const ManyInMany: FC<ManyInManyProps> = ({ title, disabled }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  return !disabled ? (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      className="oneInManyContainer"
      isSelected={isSelected}
    >
      <Flex
        align="center"
        direction="column"
        $height="100%"
        justify="center"
        pl="24px"
        $zIndex={2}
      >
        {isHover ? <WalletHoverImage /> : <WalletDefaultImage />}
        <div style={dateLabelStyle}>{title}</div>
      </Flex>
    </StyledContainer>
  ) : (
    <div style={disableContainerStyle}>
      <StyledRedInfoImage />
      <Flex
        align="center"
        direction="column"
        $height="100%"
        justify="center"
        pl="24px"
      >
        <WalletDisableImage />
        <div>{title}</div>
      </Flex>
    </div>
  );
};
