import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { LoaderDialog } from '..';

export interface FullPageLoaderDialogProps {
  title?: string;
  subtext?: string;
}

export const FullPageLoaderDialog: FC<FullPageLoaderDialogProps> = ({
  title,
  subtext,
}) => (
  <BlurOverlay>
    <LoaderDialog title={title} subtext={subtext} />
  </BlurOverlay>
);

FullPageLoaderDialog.defaultProps = {
  title: undefined,
  subtext: undefined,
};
