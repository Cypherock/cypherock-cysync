import React, { ReactElement } from 'react';
import { styled } from 'styled-components';
import { theme } from '../../themes/theme.styled';
import { AsideContainer, Container, Flex, Image, Typography } from '../atoms';
import { cysyncLogoSmall } from '../../assets/images';
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
    >
      <Image src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
      {type === 'getStarted' ? (
        <>
          <Flex direction="column" align="center">
            <Container
              $bgColor="list"
              rounded="full"
              pb={5}
              pl={5}
              pr={5}
              pt={5}
              mb={3}
            >
              <Image src={img} alt="image" />
            </Container>

            <Typography variant="h3" color="gold" mb={7}>
              cySync App
            </Typography>
            <Typography
              variant="h3"
              $textAlign="center"
              color="silver"
              font="medium"
              mb={2}
            >
              Welcome to Cypherock
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
