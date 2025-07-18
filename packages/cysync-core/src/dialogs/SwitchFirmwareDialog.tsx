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

import { useCountdown } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { useTheme } from 'styled-components';

export const SwitchFirmwareDialog: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const startTimeRef = useRef(new Date().getTime() + 12 * 1000);
  const { seconds: remainingSeconds } = useCountdown(startTimeRef.current);
  const [isChecked, setIsChecked] = useState(false);

  const texts = lang.strings.dialogs.switchFirmwareDialog;

  const onClose = useCallback(() => {
    dispatch(closeDialog('switchFirmwareDialog'));
  }, [dispatch]);

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
            onClick={onClose}
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
