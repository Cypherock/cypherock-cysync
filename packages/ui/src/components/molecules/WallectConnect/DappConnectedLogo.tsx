import React from 'react';
import { styled } from 'styled-components';
import PropTypes from 'prop-types';
import { SvgProps } from '../../../assets';
import { Image, Flex } from '../../atoms';

const LogosContainer = styled(Flex)`
  hr {
    border: none;
    border-top: 1px dotted #f00;
    color: #fff;
    background-color: #fff;
    height: 1px;
    width: 50%;
  }
  img {
    padding: 6px;
    background: #3a3531;
    border-radius: 25px;
  }
  img:first-child,
  img:last-child {
    padding: 10px;
  }
`;

export interface DappConnectedLogoProps {
  logos: [string, string, string];
}

const ConnectingLine: React.FC<SvgProps> = ({
  fill,
  width,
  height,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0.5 0.5H24.5" stroke={fill} strokeDasharray="2 2" />
  </svg>
);

ConnectingLine.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

ConnectingLine.defaultProps = {
  width: 25,
  height: 1,
  fill: '#8B8682',
};

export const DappConnectedLogo: React.FC<DappConnectedLogoProps> = ({
  logos,
}) => (
  <LogosContainer align="center">
    <Image src={logos[0]} alt="DApp" width={50} height={50} />
    <ConnectingLine />
    <Image src={logos[1]} alt="WalletConnect" width={30} height={30} />
    <ConnectingLine />
    <Image src={logos[2]} alt="CySync" width={50} height={50} />
  </LogosContainer>
);
