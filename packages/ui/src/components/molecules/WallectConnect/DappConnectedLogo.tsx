import React from 'react';
import { styled } from 'styled-components';
import PropTypes from 'prop-types';
import { SvgProps } from '../../../assets';
import { Image, Flex } from '../../atoms';

const SmallLogoContainer = styled.div`
  img,
  svg {
    padding: 6px;
    background: #3a3531;
    border-radius: 25px;
  }
`;

const LargeLogoContainer = styled.div`
  img,
  svg {
    padding: 10px;
    background: #3a3531;
    border-radius: 25px;
  }
`;

export interface DappConnectedLogoProps {
  walletConnectLogo: React.FC<SvgProps>;
  cySyncLogo: string;
  dappLogoUrl: string;
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
  walletConnectLogo: WalletConnectLogo,
  dappLogoUrl,
  cySyncLogo,
}) => (
  <Flex align="center">
    <LargeLogoContainer>
      <Image src={dappLogoUrl} alt="DApp" width={50} height={50} />
    </LargeLogoContainer>
    <ConnectingLine />
    <SmallLogoContainer>
      <WalletConnectLogo width={30} height={30} />
    </SmallLogoContainer>
    <ConnectingLine />
    <LargeLogoContainer>
      <Image src={cySyncLogo} alt="CySync" width={50} height={50} />
    </LargeLogoContainer>
  </Flex>
);
