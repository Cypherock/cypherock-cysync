import {
  ArrowBackGoldenIcon,
  Button,
  Flex,
  svgGradients,
  Synchronizing,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useBuySell2 } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

import { BuySellPage } from '../pages';

export const Header = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { onBack, onRefresh, toPage } = useBuySell2();

  const shouldShowLeftHeader = onRefresh !== undefined || onBack !== undefined;

  const goToHistory = () => {
    toPage(BuySellPage.History);
  };

  const leftHeader = () => (
    <Flex>
      {onRefresh && (
        <Button variant="none" onClick={onRefresh}>
          <Flex
            direction="row"
            gap={16}
            justify="center"
            align="center"
            px={2}
            $height="full"
          >
            <Synchronizing
              width={12}
              height={12}
              fill={`url(#${svgGradients.gold})`}
            />
            <Typography> {strings.buttons.retry} </Typography>
          </Flex>
        </Button>
      )}
      {onBack && (
        <Button variant="none" onClick={onBack}>
          <Flex
            direction="row"
            gap={16}
            justify="center"
            align="center"
            px={2}
            $height="full"
          >
            <ArrowBackGoldenIcon width={12} height={12} />
            <Typography>{strings.buttons.back}</Typography>
          </Flex>
        </Button>
      )}
    </Flex>
  );

  return (
    <Flex
      width="100%"
      direction="row"
      px={5}
      py="10"
      $bgColor="primary"
      justify={shouldShowLeftHeader ? 'space-between' : 'flex-end'}
    >
      {leftHeader()}
      <Button variant="secondary" onClick={goToHistory}>
        {strings.sidebar.history}
      </Button>
    </Flex>
  );
};
