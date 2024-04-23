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
  Markdown,
  ScrollableContainer,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { ReleaseNotesDialogProvider, useReleaseNotesDialog } from './context';

const ReleaseNotes: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useReleaseNotesDialog();
  const { buttons, dialogs } = lang.strings;
  const { releaseNote } = dialogs;

  return (
    <BlurOverlay>
      <DialogBox
        width={500}
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
          >
            <LangDisplay text={releaseNote.title} />
          </Typography>
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
            <Markdown>{window.cysyncEnv.RELEASE_NOTES ?? ''}</Markdown>
          </DialogBoxBody>
        </ScrollableContainer>
        <DialogBoxFooter>
          <Button
            onClick={onClose}
            type="submit"
            variant="primary"
            disabled={false}
          >
            <LangDisplay text={buttons.continue} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </BlurOverlay>
  );
};

export const ReleaseNotesDialog: FC = () => (
  <ReleaseNotesDialogProvider>
    <ReleaseNotes />
  </ReleaseNotesDialogProvider>
);
