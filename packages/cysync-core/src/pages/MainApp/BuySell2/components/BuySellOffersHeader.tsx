import { ClockIcon, Typography, parseLangTemplate } from '@cypherock/cysync-ui';
import { formatSecondsToMinutes } from '@cypherock/cysync-utils';
import React, { useMemo } from 'react';

import { useBuySell2 } from '~/context';
import { useAppSelector, selectLanguage } from '~/store';

export const BuySellOffersHeader: React.FC<{
  size: number;
}> = ({ size }) => {
  const { timerSeconds, isFetchingOffers } = useBuySell2();
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.buySell2.input.offersSection;

  const remainingTime = useMemo(
    () => formatSecondsToMinutes(timerSeconds),
    [timerSeconds],
  );

  if (isFetchingOffers || size === 0) {
    return <Typography color="muted">{displayText.title}</Typography>;
  }

  return (
    <Typography
      color="muted"
      justify="space-between"
      display="flex"
      $allowOverflow
    >
      <span>{parseLangTemplate(displayText.offersFound, { num: size })}</span>
      <Typography color="muted" align="center" display="flex" gap={8}>
        {parseLangTemplate(displayText.timerText)}
        <Typography
          color="white"
          align="center"
          display="flex"
          gap={8}
          $minWidth="71px"
        >
          <ClockIcon />
          {remainingTime}
        </Typography>
      </Typography>
    </Typography>
  );
};
