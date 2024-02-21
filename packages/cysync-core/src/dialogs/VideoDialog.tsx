import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC, useEffect, useRef } from 'react';

import { closeDialog, useAppDispatch } from '..';

export interface VideoDialogProps {
  src: string;
}

export const VideoDialog: FC<VideoDialogProps> = ({ src }) => {
  const dispatch = useAppDispatch();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        iframeRef.current &&
        !iframeRef.current.contains(event.target as Node)
      ) {
        dispatch(closeDialog('videoDialog'));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, iframeRef]);

  console.log(src);

  return (
    <BlurOverlay>
      <iframe
        title="video content"
        ref={iframeRef}
        height="50%"
        width="50%"
        src={src}
      />
    </BlurOverlay>
  );
};
