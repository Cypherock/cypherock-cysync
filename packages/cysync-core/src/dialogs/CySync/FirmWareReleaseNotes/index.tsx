import styled from 'styled-components';
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

const Title = styled(Typography)`
  font-size: 24px;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-top: 32px;
`;

const ReleaseNotesTitle = styled.h3`
  margin-bottom: 48px;
  color: #8b8682;
  font-weight: 400;
  font-size: 16px;
  position: inherit;
  top: -28px;
`;

const NotesContainer = styled.div`
  color: #8b8682;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  top: -56px;
  position: inherit;
`;

const ReleaseDate = styled.p`
  margin-bottom: 24px;
  padding: 4px 16px;
  background: linear-gradient(89.76deg, #16120f 0.23%, #1f1915 99.82%);
`;

const NoteSection = styled.div`
  border-radius: 5px;
  margin-bottom: 20px;
`;

const NoteTitle = styled.h4`
  margin-bottom: 16px;
  font-weight: 400;
  color: #fff;
  font-size: 18px;
`;

const NoteContent = styled.p`
  margin-bottom: 16px;
  color: #8b8682;
  font-weight: 400;
  font-size: 16px;
`;

const NoteList = styled.ul`
  margin-bottom: 20px;
  padding-left: 32px;
  font-weight: 400;
  font-size: 16px;
`;

const NoteItem = styled.li`
  margin-bottom: 5px;
`;

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
            <Title>
              <LangDisplay
                text={firmwareNote.title}
                variables={{ version: version ?? 'N/A' }}
              />
            </Title>
            <ReleaseNotesTitle>Release Notes</ReleaseNotesTitle>
            <NotesContainer>
              <ReleaseDate>Released February 31, 2023</ReleaseDate>
              <NoteSection>
                <NoteTitle>Lorem ipsum</NoteTitle>
                <NoteContent>
                  {
                    ' Duis a arcu quis velit commodo volutpat. Suspendisse enim ipsum, blandit elementum nibh non, convallis consectetur justo. Etiam ornare commodo orci.'
                  }
                </NoteContent>
                <NoteList>
                  <NoteItem>Duis a arcu quis velit commodo</NoteItem>
                  <NoteItem>volutpat. Suspendisse enim ipsum,</NoteItem>
                  <NoteItem>blandit elementum nibh non, convallis</NoteItem>
                  <NoteItem>
                    consectetur justo. Etiam ornare commodo orci.
                  </NoteItem>
                </NoteList>
                <NoteTitle>Lorem ipsum</NoteTitle>
                <NoteContent>
                  {
                    ' Duis a arcu quis velit commodo volutpat. Suspendisse enim ipsum, blandit elementum nibh non, convallis consectetur justo. Etiam ornare commodo orci.'
                  }
                </NoteContent>
                <NoteList>
                  <NoteItem>Duis a arcu quis velit commodo</NoteItem>
                  <NoteItem>volutpat. Suspendisse enim ipsum,</NoteItem>
                  <NoteItem>blandit elementum nibh non, convallis</NoteItem>
                  <NoteItem>
                    consectetur justo. Etiam ornare commodo orci.
                  </NoteItem>
                </NoteList>
              </NoteSection>
            </NotesContainer>
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
