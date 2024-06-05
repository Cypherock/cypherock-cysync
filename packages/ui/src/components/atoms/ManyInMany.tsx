import React, { FC, useState, CSSProperties } from 'react';
import { styled } from 'styled-components';

import { Flex } from './Flex';

import {
  mimDefault,
  mimDefaultWallet,
  mimDisableWallet,
  mimHover,
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
};

const WalletDefaultImage = styled.img.attrs({
  src: mimDefaultWallet,
  alt: 'wallet',
})``;

const WalletHoverImage = styled.img.attrs({
  src: mimHovertWallet,
  alt: 'wallet hover',
})``;

const WalletDisableImage = styled.img.attrs({
  src: mimDisableWallet,
  alt: 'wallet hover',
})``;

const RedInfoImage = styled.img.attrs({
  src: redInfo,
  alt: 'Info',
})``;

export interface ManyInManyProps {
  title: string;
  disabled: boolean;
}

const StyledContainer = styled.div<{ isSelected: boolean }>`
  &:hover {
    background-image: ${({ isSelected }) =>
      !isSelected
        ? `linear-gradient(120.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 100%), url(${mimHover}), linear-gradient(0deg, #332F2D, #332F2D)`
        : 'linear-gradient(102.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 100%),linear-gradient(0deg, #332F2D, #332F2D)'};
    background-position: left bottom;
    background-size: inherit;
  }
  box-shadow: ${({ isSelected }) =>
    !isSelected
      ? '0px 0px 12px 4px #1B1813'
      : '0px 0px 12px 4px #1B1813 inset'};
  border: ${({ isSelected }) => (isSelected ? '1px solid #e0bb74' : '')};
  background: ${({ isSelected }) =>
    !isSelected
      ? `linear-gradient(300.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 57.81%, rgba(0, 0, 0, 0) 100%), url(${mimDefault}),linear-gradient(0deg, #2A2827, #2A2827)`
      : ` #2A2827`};
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 8px;
  overflow: hidden;
  width: 276px;
  cursor: pointer;
  height: 128px;
  color: #ffffff;
  padding: 24px 16px 24px 16px;
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
      >
        {isHover ? <WalletHoverImage /> : <WalletDefaultImage />}
        <div style={dateLabelStyle}>{title}</div>
      </Flex>
    </StyledContainer>
  ) : (
    <div style={disableContainerStyle}>
      <RedInfoImage
        style={{ position: 'absolute', right: '10px', top: '10px' }}
      />
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
