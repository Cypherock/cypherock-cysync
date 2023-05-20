import React, { FC } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../utils';
import { Image } from '../atoms/Image';
import { Flex } from '../atoms/Flex';
import {
  cardProgressIcon,
  commonAsideImage,
  cysyncLogoSmall,
  deviceAuthAsideImage,
  deviceAuthProgressIcon,
  emailAuthProgressIcon,
  joyStickProgressIcon,
  setPassProgressIcon,
  termsProgressIcon,
} from '../../assets/images';
import { Typography } from '../atoms/Typography';

interface AsideProps extends UtilsProps {
  progress: number;
  title: string;
  asideImage: 'common' | 'deviceAuth';
}

const AsideStyle = styled.div<UtilsProps>`
  ${utils}
  min-width: 280px;
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    102.78deg,
    #211c18 0%,
    #211a16 59.38%,
    #252219 100%
  );
  @media ${({ theme }) => theme.screens.laptopL} {
    min-width: 500px;
    padding: 32px 40px;
  }
`;

const asideImageObj: Record<string, string> = {
  common: commonAsideImage,
  deviceAuth: deviceAuthAsideImage,
};

const progressIconsObj: Record<number, string> = {
  1: termsProgressIcon,
  2: setPassProgressIcon,
  3: emailAuthProgressIcon,
  4: deviceAuthProgressIcon,
  5: joyStickProgressIcon,
  6: cardProgressIcon,
};

export const Aside: FC<AsideProps> = ({
  progress,
  title,
  asideImage,
  ...props
}) => (
  <AsideStyle {...props}>
    <Image src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
    <Flex direction="column" align="center">
      <Image src={asideImageObj[asideImage]} alt="device" width={250} />
    </Flex>
    <Flex direction="column" width="full" align="center">
      <Typography
        variant="h3"
        color="silver"
        width="full"
        $textAlign="center"
        mb={3}
        font="medium"
      >
        {title}
      </Typography>
      <Image
        type="progressBar"
        src={progressIconsObj[progress]}
        alt="progress"
      />
    </Flex>
  </AsideStyle>
);
