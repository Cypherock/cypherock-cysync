// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import {
  mimDefault,
  mimDefaultWallet,
  mimDisableWallet,
  mimHover,
  mimHovertWallet,
  redInfo,
} from '../../assets';

const Flex = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 24px;
  font-family: Poppins;
`;

const DisableContainer = styled.div`
  position: relative;
  background: #282522;
  overflow: hidden;
  border-radius: 8px;
  width: 276px;
  height: 128px;
  padding: 24px 16px 24px 16px;
  color: #39322c;
`;

const DateLabel = styled.p`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
`;

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
  selected: boolean;
}

export const ManyInMany: FC<ManyInManyProps> = ({
  disabled,
  selected,
  title,
}) => {
  console.log(title);
  const [isHover, setIsHover] = useState(false);

  const StyledContainer = styled.div`
    &:hover {
      background-image: ${!selected
        ? `linear-gradient(120.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 100%), url(${mimHover}), linear-gradient(0deg, #332F2D, #332F2D)`
        : 'linear-gradient(102.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 100%),linear-gradient(0deg, #332F2D, #332F2D)'};
      background-position: left bottom;
      background-size: inherit;
    }
    box-shadow: ${!selected
      ? '0px 0px 12px 4px #1B1813'
      : '0px 0px 12px 4px #1B1813 inset'};
    border: ${selected ? '1px solid #e0bb74' : ''};
    background: ${!selected
      ? `linear-gradient(300.14deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 57.81%, rgba(0, 0, 0, 0) 100%), url(${mimDefault}),linear-gradient(0deg, #2A2827, #2A2827)`
      : ` #2A2827`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 8px;
    overflow: hidden;
    width: 276px;
    height: 128px;
    color: #ffffff;
    padding: 24px 16px 24px 16px;
  `;
  return !disabled ? (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="oneInManyContainer"
    >
      <Flex>
        {isHover ? <WalletHoverImage /> : <WalletDefaultImage />}
        <DateLabel>DDDDDDDDDDDD</DateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <DisableContainer>
      <RedInfoImage
        style={{ position: 'absolute', right: '10px', top: '10px' }}
      />
      <Flex>
        <WalletDisableImage />
        <DateLabel>DDDDDDDDDDDD</DateLabel>
      </Flex>
    </DisableContainer>
  );
};
ManyInMany.propTypes = {
  title: PropTypes.string.isRequired,
};
