import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ReleaseNotesDialogProvider, useReleaseNotesDialog } from './context';

const ReleaseNotes: FC = () => {
  const { currentDialog, tabs, currentTab } = useReleaseNotesDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const ReleaseNotesDialog: FC = () => (
  <ReleaseNotesDialogProvider>
    <ReleaseNotes />
  </ReleaseNotesDialogProvider>
);
