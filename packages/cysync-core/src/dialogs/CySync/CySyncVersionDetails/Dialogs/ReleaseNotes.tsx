import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  CloseButton,
  Flex,
  Divider,
  Markdown,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useCySyncVersionDetailsDialog } from '../context';

export const ReleaseNotes: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useCySyncVersionDetailsDialog();
  const { buttons, dialogs } = lang.strings;
  const { releaseNote } = dialogs.cysync;

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} p={0} align="stretch">
        <Flex
          px={{ def: 3, lg: 5 }}
          pt={4}
          pb={{ def: 2, lg: 4 }}
          gap={4}
          direction="column"
          align="stretch"
        >
          <Typography color="white" $fontSize={24} $textAlign="center">
            <LangDisplay
              text={releaseNote.title}
              variables={{ version: window.cysyncEnv.VERSION }}
            />
          </Typography>
          <Typography color="muted" $fontSize={16} $textAlign="center">
            <LangDisplay text={releaseNote.subTitle} />
          </Typography>
        </Flex>
        <Flex
          px={{ def: 3, lg: 5 }}
          pt={2}
          pb={{ def: 2, lg: 4 }}
          direction="column"
          align="stretch"
        >
          <Markdown>{window.cysyncEnv.RELEASE_NOTES ?? ''}</Markdown>
        </Flex>
      </DialogBoxBody>
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
