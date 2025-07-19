import {
  BlurOverlay,
  Button,
  CheckBox,
  Flex,
  IconDialogBox,
  InfoItalicsIcon,
  MessageBox,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import { setIsLastConnectedFirmwareBtcOnly } from '~/actions/lastConnectedFirmware';
import { openDeviceUpdateDialog } from '~/actions';
import { useCountdown } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export const SwitchFirmwareDialog: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const startTimeRef = useRef(new Date().getTime() + 12 * 1000);
  const { seconds: remainingSeconds } = useCountdown(startTimeRef.current);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const texts = lang.strings.dialogs.switchFirmwareDialog;

  const onClose = useCallback(() => {
    dispatch(closeDialog('switchFirmwareDialog'));
  }, [dispatch]);

  const onInstallFirmware = useCallback(() => {
    setLoading(true);
    dispatch(setIsLastConnectedFirmwareBtcOnly(true));
    dispatch(openDeviceUpdateDialog());
    setLoading(false);
    onClose();
  }, [dispatch, onClose, setLoading]);

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
        title={texts.title}
        subtext={texts.subtext}
        afterTextComponent={
          <>
            <MessageBox text={texts.messageBox.text} type="danger" />
            <Flex direction="row" justify="center">
              <CheckBox
                checked={isChecked}
                id="switch_firmware_confirmed"
                onChange={() => setIsChecked(!isChecked)}
                label={texts.checkbox.label}
              />
            </Flex>
          </>
        }
        footerComponent={
          <Button
            onClick={onInstallFirmware}
            variant="primary"
            disabled={!isChecked || loading || remainingSeconds > 0}
          >
            {texts.primaryBtn.label}
            {remainingSeconds > 0 && ` ${remainingSeconds}s`}
          </Button>
        }
      />
    </BlurOverlay>
  );
};
