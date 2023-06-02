import React, { ReactElement } from 'react';
import { styled } from 'styled-components';
import { theme } from '../../themes/theme.styled';
import { AsideContainer, Container, Flex, Image, Typography } from '../atoms';
import { cysyncLogoSmall, logoText } from '../../assets/images';
import { Milestone } from './Milestone';

export interface AsideProps {
  img: string;
  text?: string;
  currentState?: number;
  totalState?: number;
  type?: 'getStarted';
}

const Text = styled.span`
  font-size: 27px;

  @media ${theme.screens.lg} {
    font-size: 40px;
  }
`;

export const Aside = (props: AsideProps): ReactElement => {
  const { img, text, currentState, totalState, type } = props;
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
      {type === 'getStarted' ? (
        <>
          <Flex direction="column" align="center">
            <Container
              $bgColor="separator"
              rounded="full"
              width={176}
              height={176}
              p={5}
              mb={3}
            >
              <Image src={img} alt="image" />
            </Container>
            <Image width="full" src={logoText} alt="logoText" mb={4} />
            <Typography
              variant="h4"
              $textAlign="center"
              color="silver"
              font="medium"
              width="full"
              mb={2}
            >
              Welcome to CySync App
            </Typography>
            <Typography
              $textAlign="center"
              variant="h5"
              color="muted"
              font="light"
            >
              Your Gateway to Self-Sovereignty
            </Typography>
          </Flex>
          <Typography
            color="muted"
            $textAlign="center"
            width="full"
            variant="fineprint"
          >
            ver 2. 314. 3094
          </Typography>
        </>
      ) : (
        currentState &&
        totalState && (
          <>
            <Flex direction="column" align="center" width="full">
              <Image src={img} alt="image" width="full" />
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
          </>
        )
      )}
    </AsideContainer>
  );
};

Aside.defaultProps = {
  type: undefined,
  text: undefined,
  currentState: undefined,
  totalState: undefined,
};
