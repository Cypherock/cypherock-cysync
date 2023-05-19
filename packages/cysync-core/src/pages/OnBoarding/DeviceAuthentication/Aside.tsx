import React, { ReactElement } from 'react';
import {
  AsideContainer,
  Flex,
  Image,
  Typography,
  deviceAuthProgressIcon,
  cysyncLogoSmall,
} from '@cypherock/cysync-ui';
import { deviceImage } from '../../../assets/images/onboarding';

export const Aside = (): ReactElement => (
  <AsideContainer
    $bgColor="sideBar"
    direction="column"
    justify="space-between"
    align="center"
  >
    <Image src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
    <Flex direction="column" align="center">
      <Image src={deviceImage} alt="device" width={250} />
    </Flex>
    <Flex direction="column" width="wFull" align="center">
      <Typography
        variant="h3"
        color="silver"
        width="wFull"
        $textAlign="center"
        mb={3}
        font="medium"
      >
        Device Authentication
      </Typography>
      <Image src={deviceAuthProgressIcon} alt="cardProgress" />
    </Flex>
  </AsideContainer>
);
