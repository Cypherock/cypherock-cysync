import {
  BlurOverlay,
  Button,
  CheckBox,
  Flex,
  IconDialogBox,
  InfoItalicsIcon,
} from '@cypherock/cysync-ui';
import { FirmwareVariant } from '@cypherock/sdk-app-manager';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import { openDeviceUpdateDialog } from '~/actions';
import { useCountdown } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  selectLastConnectedFirmware,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const selector = createSelector(
  [selectLanguage, selectLastConnectedFirmware],
  ({ strings }, { isFirmwareBtcOnly }) => ({
    strings,
    isFirmwareBtcOnly,
  }),
);

export const SwitchFirmwareDialog: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { strings, isFirmwareBtcOnly } = useAppSelector(selector);

  const startTimeRef = useRef(new Date().getTime() + 12 * 1000);
  const { seconds: remainingSeconds } = useCountdown(startTimeRef.current);
  const [isChecked, setIsChecked] = useState(false);

  const texts = strings.dialogs.switchFirmwareDialog;
  const { title, subtext } = isFirmwareBtcOnly
    ? texts.multiCoin
    : texts.btcOnly;

  const onClose = useCallback(() => {
    dispatch(closeDialog('switchFirmwareDialog'));
  }, [dispatch]);

  const onInstallFirmware = useCallback(() => {
    onClose();
    dispatch(
      openDeviceUpdateDialog({
        forcedVariant: !isFirmwareBtcOnly
          ? FirmwareVariant.BTC_ONLY
          : FirmwareVariant.MULTI_COIN,
      }),
    );
  }, [dispatch, onClose, isFirmwareBtcOnly]);

  return (
    <BlurOverlay>
      <IconDialogBox
        width={700}
        onClose={onClose}
        icon={
          <InfoItalicsIcon
            width={56}
            height={48}
            fill={theme?.palette.background.danger}
          />
        }
        title={title}
        subtext={subtext}
        afterTextComponent={
          <Flex direction="row" justify="center">
            <CheckBox
              checked={isChecked}
              id="switch_firmware_confirmed"
              onChange={() => setIsChecked(!isChecked)}
              label={texts.checkbox.label}
            />
          </Flex>
        }
        footerComponent={
          <Button
            onClick={onInstallFirmware}
            variant="primary"
            disabled={!isChecked || remainingSeconds > 0}
          >
            {texts.primaryBtn.label}
            {remainingSeconds > 0 && ` ${remainingSeconds}s`}
          </Button>
        }
      />
    </BlurOverlay>
  );
};
