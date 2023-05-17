import React, { ReactElement } from 'react';
import {
  AsideContainer,
  Flex,
  Image,
  Typography,
  asideIcon,
  cysyncLogoSmall,
  termsProgressIcon,
} from '@cypherock/cysync-ui';

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
      <Image src={asideIcon} alt="aside" />
    </Flex>
    <Flex direction="column" width="wFull" align="center">
      <Typography
        variant="h2"
        color="silver"
        width="full"
        $textAlign="center"
        mb={3}
        font="medium"
      >
        Terms of Use
      </Typography>
      <Image src={termsProgressIcon} alt="termsProgress" />
    </Flex>
  </AsideContainer>
);
