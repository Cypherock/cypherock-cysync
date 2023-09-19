import React, { ReactElement } from 'react';
import { styled } from 'styled-components';

import { cysyncLogoBig, cysyncLogoSmall } from '../../../assets/images';
import { theme } from '../../../themes/theme.styled';
import {
  AsideContainer,
  Flex,
  Image,
  LangDisplay,
  Typography,
} from '../../atoms';

export interface InfoAsideProps {
  title: string;
  subTitle: string;
  version: string;
}

const HeadingFiveText = styled.span`
  font-size: 18px;

  @media ${theme.screens.lg} and ${theme.screensHeight.lg} {
    font-size: 24px;
  }
`;

export const InfoAside = (props: InfoAsideProps): ReactElement => {
  const { title, subTitle, version } = props;
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
      <Flex width="full" direction="column" align="center">
        <Image $width="full" src={cysyncLogoBig} alt="logo" mb={7} />
        <Typography
          variant="h5"
          $textAlign="center"
          color="silver"
          $fontWeight="medium"
          width="full"
          mb={2}
        >
          <HeadingFiveText>
            <LangDisplay text={title} />
          </HeadingFiveText>
        </Typography>
        <Typography
          $textAlign="center"
          variant="h6"
          color="muted"
          $fontWeight="light"
        >
          <LangDisplay text={subTitle} />
        </Typography>
      </Flex>
      <Typography
        color="muted"
        $textAlign="center"
        width="full"
        variant="fineprint"
        $letterSpacing={0.12}
      >
        <LangDisplay text={version} />
      </Typography>
    </AsideContainer>
  );
};
