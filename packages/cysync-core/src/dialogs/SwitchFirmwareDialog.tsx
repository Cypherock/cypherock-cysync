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
import { closeDialog, useAppDispatch } from '~/store';
import { useTheme } from 'styled-components';

export const SwitchFirmwareDialog: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [isChecked, setIsChecked] = useState(false);
  const startTimeRef = useRef(new Date().getTime() + 12 * 1000);
  const { seconds: remainingSeconds } = useCountdown(startTimeRef.current);

  const onClose = useCallback(() => {
    dispatch(closeDialog('switchFirmwareDialog'));
  }, [dispatch]);

  return (
    <BlurOverlay>
      {/* <DialogBox
        width={700}
        align="stretch"
        gap={0}
        onClose={onClose}
      >
        <DialogBoxHeader direction="row" py={2} px={3} justify="flex-end">
          <CloseButton width={24} onClick={onClose} />
        </DialogBoxHeader>
        <Divider variant="horizontal" />
        <DialogBoxBody
          gap={{ def: 16, lg: 32 }}
          px={{ def: 3, lg: 5 }}
          pt={{ def: 4, lg: 4 }}
          pb={{ def: 2, lg: 4 }}
          align="center"
          direction="column"
        >
          <InfoItalicsIcon width={56} height={48} fill={theme?.palette.background.danger} />
          <Flex direction="column" align="stretch">
            <Typography color="white" $fontSize={20} $textAlign="center">
              Switch firmware to Bitcoin-only
            </Typography>
            <Typography color="muted" $fontSize={16} $textAlign="center">
              Bitcoin-only firmware only works with Bitcoin transactions. If you want to access and manage all of your coins other than Bitcoin also then you'll not be able to do that
            </Typography>
          </Flex>

          <MessageBox text="Once you install the Bitcoin-only firmware, you cannot switch back to the Multi-coin firmware." type="danger" />

          <Flex direction="row" justify="center">
            <CheckBox
              checked={isChecked}
              id="switch_firmware_confirmed"
              onChange={() => setIsChecked(!isChecked)}
              label={'I have read and understood'}
            />
          </Flex>

          <Button
            onClick={onClose}
            variant="primary"
            disabled={!isChecked}
            $alignSelf="center"
            px={{ def: '14', lg: 3 }}
            py={{ def: '6', lg: 1 }}
            // $borderRadius={{ def: 4, lg: 6 }}
            justify="center"
          >
            Install Firmware <span color="white">10s</span>
          </Button>
          
        </DialogBoxBody>
      </DialogBox> */}
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
        title="Switch firmware to Bitcoin-only"
        subtext={
          "Bitcoin-only firmware only works with Bitcoin transactions. If you want to access and manage all of your coins other than Bitcoin also then you'll not be able to do that"
        }
        afterTextComponent={
          <>
            <MessageBox
              text="Once you install the Bitcoin-only firmware, you cannot switch back to the Multi-coin firmware."
              type="danger"
            />
            <Flex direction="row" justify="center">
              <CheckBox
                checked={isChecked}
                id="switch_firmware_confirmed"
                onChange={() => setIsChecked(!isChecked)}
                label="I have read and understood"
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
            Install Firmware{' '}
            <span color="white!">
              {remainingSeconds > 0 && `${remainingSeconds}s`}
            </span>
          </Button>
        }
      />
    </BlurOverlay>
  );
};
