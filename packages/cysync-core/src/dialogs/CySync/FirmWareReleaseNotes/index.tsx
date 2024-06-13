import {
  BlurOverlay,
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Divider,
  LangDisplay,
  ScrollableContainer,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import {
  FirmwareReleaseNotesDialogProvider,
  useFirmwareReleaseNotesDialog,
} from './context';
import { useLatestDeviceVersion } from '~/context';
import { openDeviceUpdateDialog } from '~/actions';

const FirmWareReleaseNotes: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useFirmwareReleaseNotesDialog();
  const dispatch = useAppDispatch();
  const { buttons, dialogs } = lang.strings;
  const { firmwareNote } = dialogs;
  const { version } = useLatestDeviceVersion();

  return (
    <BlurOverlay>
      <DialogBox
        width={700}
        align="stretch"
        gap={0}
        $maxHeight="90vh"
        onClose={onClose}
      >
        <DialogBoxHeader direction="row" py={2} px={3}>
          <Typography
            pl={3}
            grow={1}
            $alignSelf="stretch"
            color="muted"
            $textAlign="center"
          />
          <CloseButton width={24} onClick={onClose} />
        </DialogBoxHeader>
        <Divider variant="horizontal" />
        <ScrollableContainer>
          <DialogBoxBody
            px={{ def: 3, lg: 5 }}
            pt={2}
            pb={{ def: 2, lg: 4 }}
            direction="column"
            align="stretch"
          >
            <Typography
              $fontSize={24}
              justify="center"
              display="flex"
              align="center"
              mt="32px"
            >
              <LangDisplay
                text={firmwareNote.title}
                variables={{ version: version ?? 'N/A' }}
              />
            </Typography>
            <h3
              style={{
                marginBottom: '48px',
                color: '#8B8682',
                fontWeight: '400',
                fontSize: '16px',
                position: 'inherit',
                top: '-28px',
              }}
            >
              Release Notes
            </h3>
            <div
              style={{
                color: '#8B8682',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'left',
                top: '-56px',
                position: 'inherit',
              }}
            >
              <p
                style={{
                  marginBottom: '24px',
                  padding: '4px 16px',
                  background:
                    'linear-gradient(89.76deg, #16120F 0.23%, #1F1915 99.82%)',
                }}
              >
                Released February 31, 2023
              </p>
              <div
                style={{
                  borderRadius: '5px',
                  marginBottom: '20px',
                }}
              >
                <h4
                  style={{
                    marginBottom: '16px',
                    fontWeight: '400',
                    color: '#fff',
                    fontSize: '18px',
                  }}
                >
                  Lorem ipsum
                </h4>
                <p
                  style={{
                    marginBottom: '16px',
                    color: '#8B8682',
                    fontWeight: '400',
                    fontSize: '16px',
                  }}
                >
                  Duis a arcu quis velit commodo volutpat. Suspendisse enim
                  ipsum, blandit elementum nibh non, convallis consectetur
                  justo. Etiam ornare commodo orci.
                </p>
                <ul
                  style={{
                    marginBottom: '20px',
                    paddingLeft: '32px',
                    fontWeight: '400',
                    fontSize: '16px',
                  }}
                >
                  <li style={{ marginBottom: '5px' }}>
                    Duis a arcu quis velit commodo
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    volutpat. Suspendisse enim ipsum,
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    blandit elementum nibh non, convallis
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    consectetur justo. Etiam ornare commodo orci.
                  </li>
                </ul>
                <h4
                  style={{
                    marginBottom: '16px',
                    fontWeight: '400',
                    color: '#fff',
                    fontSize: '18px',
                  }}
                >
                  Lorem ipsum
                </h4>
                <p
                  style={{
                    marginBottom: '16px',
                    fontWeight: '400',
                    fontSize: '16px',
                  }}
                >
                  Duis a arcu quis velit commodo volutpat. Suspendisse enim
                  ipsum, blandit elementum nibh non, convallis consectetur
                  justo. Etiam ornare commodo orci.
                </p>
                <ul
                  style={{
                    marginBottom: '20px',
                    paddingLeft: '32px',
                    fontWeight: '400',
                    fontSize: '16px',
                  }}
                >
                  <li style={{ marginBottom: '5px' }}>
                    Duis a arcu quis velit commodo
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    volutpat. Suspendisse enim ipsum,
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    blandit elementum nibh non, convallis
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    consectetur justo. Etiam ornare commodo orci.
                  </li>
                </ul>
              </div>
            </div>
          </DialogBoxBody>
        </ScrollableContainer>
        <DialogBoxFooter>
          <Button
            onClick={() => dispatch(openDeviceUpdateDialog())}
            type="submit"
            variant="primary"
            disabled={false}
          >
            <LangDisplay text={buttons.downloadUpdate} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </BlurOverlay>
  );
};

export const FirmwareReleaseNotesDialog: FC = () => (
  <FirmwareReleaseNotesDialogProvider>
    <FirmWareReleaseNotes />
  </FirmwareReleaseNotesDialogProvider>
);
