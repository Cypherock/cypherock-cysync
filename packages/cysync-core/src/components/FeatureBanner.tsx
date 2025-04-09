import {
  Container,
  Typography,
  Button,
  Image,
  cysyncLogoSmall,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export const FeatureBanner: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const location = useLocation();
  const navigateTo = useNavigateTo();

  const { path } = routes.portfolio;

  if (!location.pathname.startsWith(path)) {
    return null;
  }

  const toCypherockCover = useCallback(() => {
    navigateTo(routes.inheritance.home.path);
  }, [navigateTo]);

  return (
    <Container $bgColor="contentGradient" width="full">
      <Container
        direction="row"
        $bgColor="featureBanner"
        width="full"
        justify="flex-start"
        p={2}
        $borderRadius={16}
        gap={16}
      >
        <Image
          src={cysyncLogoSmall}
          alt="cypherock logo"
          $width={24}
          $height={30}
        />
        <Typography $fontSize={16} width="100%">
          {lang.strings.inheritance.banner.title}
        </Typography>
        <Button variant="text" onClick={toCypherockCover}>
          <Typography color="gold" $whiteSpace="nowrap">
            {lang.strings.inheritance.banner.buttons.knowMore}
          </Typography>
        </Button>
      </Container>
    </Container>
  );
};
