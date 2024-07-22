import {
  Container,
  FirmwareIcon,
  LangDisplay,
  UpdateBar,
  useTheme,
} from '@cypherock/cysync-ui';
import React from 'react';

import { openBetaNotificationDialog } from '~/actions';

import { selectLanguage, useAppDispatch, useAppSelector } from '..';

export const BetaNotificationBar = () => {
  const isBeta = window.cysyncEnv.CHANNEL === 'beta';
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);

  const dispatch = useAppDispatch();

  if (!isBeta) return null;

  return (
    <Container px={2} pt={1} pb={1} $bgColor="contentGradient" width="full">
      <UpdateBar
        icon={
          <FirmwareIcon
            width={21}
            height={18}
            fill={theme.palette.text.heading}
            stroke={theme.palette.text.heading}
          />
        }
        onButtonClick={() => {
          dispatch(openBetaNotificationDialog());
        }}
        text={<LangDisplay text={lang.strings.betaNotificationBar.message} />}
        buttonText={lang.strings.betaNotificationBar.button}
      />
    </Container>
  );
};
