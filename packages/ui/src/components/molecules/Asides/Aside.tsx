import React, { ReactElement } from 'react';
import { styled } from 'styled-components';

import { cysyncLogoSmall } from '../../../assets/images';
import { theme } from '../../../themes/theme.styled';
import {
  AsideContainer,
  Flex,
  Image,
  LangDisplay,
  Typography,
} from '../../atoms';
import { Milestone } from '../Milestone';

export interface AsideProps {
  img: string;
  text: string;
  currentState: number;
  totalState: number;
}

const Text = styled.span`
  font-size: 27px;

  @media ${theme.screens.lg} and ${theme.screensHeight.lg} {
    font-size: 40px;
  }
`;

export const Aside = (props: AsideProps): ReactElement => {
  const { img, text, currentState, totalState } = props;
  return (
    <AsideContainer
      $bgColor="sideBar"
      direction="column"
      justify="space-between"
      align="center"
      height="full"
      position="relative"
    >
      <Image src={cysyncLogoSmall} alt="logo" $alignSelf="start" />

      <Image
        src={img}
        alt="device"
        $width="full"
        position="absolute"
        top={0.5}
        left={0.5}
        $translateY={-0.5}
        $translateX={-0.5}
      />
      <Flex direction="column" width="full" align="center" $zIndex={2}>
        <Typography
          color="silver"
          width="full"
          $textAlign="center"
          $fontWeight="medium"
          mb={4}
        >
          <Text>
            <LangDisplay text={text} />
          </Text>
        </Typography>
        <Milestone currentState={currentState} totalState={totalState} />
      </Flex>
    </AsideContainer>
  );
};
