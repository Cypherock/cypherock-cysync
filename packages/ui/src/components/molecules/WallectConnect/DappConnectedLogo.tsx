import React, { useEffect } from 'react';
import { styled } from 'styled-components';

import { ConnectingLine, SvgProps } from '../../../assets';
import { Image, Flex } from '../../atoms';

const SmallLogoContainer = styled.div`
  img,
  svg {
    padding: 6px;
    background: ${({ theme }) => theme.palette.background.containerSecondary};
    border-radius: 25px;
  }
`;

const LargeLogoContainer = styled.div`
  img,
  svg {
    padding: 10px;
    background: ${({ theme }) => theme.palette.background.containerSecondary};
    border-radius: 25px;
  }
`;

export interface DappConnectedLogoProps {
  walletConnectLogo: React.FC<SvgProps>;
  cySyncLogo: string;
  dappLogoUrl: string;
}

export const DappConnectedLogo: React.FC<DappConnectedLogoProps> = ({
  walletConnectLogo: WalletConnectLogo,
  dappLogoUrl,
  cySyncLogo,
}) => {
  const [showFallbackLogo, setShowFallbackLogo] = React.useState(false);

  useEffect(() => {
    setShowFallbackLogo(false);
  }, [dappLogoUrl]);

  const onError = () => {
    setShowFallbackLogo(true);
  };

  if (showFallbackLogo)
    return (
      <Flex align="center">
        <WalletConnectLogo width={50} height={50} />
      </Flex>
    );

  return (
    <Flex align="center">
      <LargeLogoContainer>
        <Image
          src={dappLogoUrl}
          alt="DApp"
          $width={50}
          $height={50}
          onError={onError}
        />
      </LargeLogoContainer>
      <ConnectingLine />
      <SmallLogoContainer>
        <WalletConnectLogo width={30} height={30} />
      </SmallLogoContainer>
      <ConnectingLine />
      <LargeLogoContainer>
        <Image src={cySyncLogo} alt="CySync" $width={50} $height={50} />
      </LargeLogoContainer>
    </Flex>
  );
};
