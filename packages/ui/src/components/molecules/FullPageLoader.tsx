import React from 'react';
import { Flex, Image } from '../atoms';
import { goldLoaderIcon } from '../../assets/images';

export const FullPageLoader: React.FC = () => (
  <Flex
    height="screen"
    width="screen"
    justify="center"
    align="center"
    $bgColor="contentGradient"
  >
    <Image
      src={goldLoaderIcon}
      width={108}
      alt="Loader icon"
      animate="spin"
      $animDuration={3}
    />
  </Flex>
);
