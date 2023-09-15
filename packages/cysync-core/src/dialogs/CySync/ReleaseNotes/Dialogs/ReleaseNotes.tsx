import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  CloseButton,
  Divider,
  Markdown,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useReleaseNotesDialog } from '../context';
import { DialogBoxHeader } from '@cypherock/cysync-ui/src';

export const ReleaseNotes: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useReleaseNotesDialog();
  const { buttons, dialogs } = lang.strings;
  const { releaseNote } = dialogs;

  return (
    <DialogBox width={500} align="stretch" gap={0} $maxHeight="90vh">
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
  );
};
