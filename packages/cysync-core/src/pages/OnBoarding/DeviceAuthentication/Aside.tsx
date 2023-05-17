import React, { ReactElement } from 'react';
import {
  AsideContainer,
  Flex,
  Image,
  Typography,
  cardProgressIcon,
  cysyncLogoSmall,
} from '@cypherock/cysync-ui';
import { deviceImage } from '../../../assets/images/onboarding';

export const Aside = (): ReactElement => (
  <AsideContainer
    $bgColor="sideBar"
    size="lg"
    direction="column"
    justify="space-between"
    align="center"
  >
    <Image src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
    <Flex direction="column" align="center">
      <Image src={deviceImage} alt="device" />
    </Flex>
    <Flex direction="column" width="wFull" align="center">
      <Typography
        variant="h2"
        color="silver"
        width="wFull"
        $textAlign="center"
        mb={3}
        font="medium"
      >
        Device Authentication
      </Typography>
      <Image src={cardProgressIcon} alt="cardProgress" />
    </Flex>
  </AsideContainer>
);
