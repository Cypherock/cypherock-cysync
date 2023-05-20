import React, { ReactElement } from 'react';
import { styled } from 'styled-components';
import { theme } from '../../themes/theme.styled';
import { AsideContainer, Flex, Image, Typography } from '../atoms';
import { cysyncLogoSmall } from '../../assets/images';
import { Milestone } from './Milestone';

interface IAsideProps {
  img: string;
  text: string;
  currentState: number;
  totalState: number;
}

const Text = styled.span`
  font-size: 27px;

  @media ${theme.screens.lg} {
    font-size: 40px;
  }
`;
export const Aside = (props: IAsideProps): ReactElement => {
  const { img, text, currentState, totalState } = props;
  return (
    <AsideContainer
      $bgColor="sideBar"
      direction="column"
      justify="space-between"
      align="center"
      height="full"
    >
      <Image src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
      <Flex direction="column" align="center" width="full">
        <Image src={img} alt="device" width="full" />
      </Flex>
      <Flex direction="column" width="wFull" align="center" px={4}>
        <Typography
          color="silver"
          width="wFull"
          $textAlign="center"
          font="medium"
          mb={4}
        >
          <Text>{text}</Text>
        </Typography>
        <Milestone currentState={currentState} totalState={totalState} />
      </Flex>
    </AsideContainer>
  );
};
