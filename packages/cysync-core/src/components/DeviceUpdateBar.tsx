import {
  LangDisplay,
  UpdateBar,
  Container,
  FirmwareIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import { openDeviceUpdateDialog } from '~/actions';

import {
  selectLanguage,
  useAppDispatch,
  useAppSelector,
  useLatestDeviceVersion,
} from '..';

export const DeviceUpdateBar: FC = () => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const { version } = useLatestDeviceVersion();

  if (!version) {
    return null;
  }

  return (
    <Container px={2} pt={2} pb={1} $bgColor="contentGradient" width="full">
      <UpdateBar
        icon={
          <FirmwareIcon
            width={21}
            height={18}
            fill={theme?.palette.text.heading}
            stroke={theme?.palette.text.heading}
          />
        }
        onButtonClick={() => {
          dispatch(openDeviceUpdateDialog());
        }}
        text={
          <LangDisplay
            text={lang.strings.deviceUpdateBar.message}
            variables={{ version }}
          />
        }
        buttonText={lang.strings.deviceUpdateBar.button}
      />
    </Container>
  );
};
