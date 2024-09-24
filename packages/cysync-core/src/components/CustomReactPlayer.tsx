import {
  VideoPlaybackError,
  VideoPlaybackErrorSize,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { selectLanguage, useAppSelector } from '~/store';

interface CustomReactPlayerProps extends ReactPlayerProps {
  size?: VideoPlaybackErrorSize;
}

const sizeMap = {
  default: {
    width: '720px',
    height: '405px',
  },
  big: {
    width: '900px',
    height: '508px',
  },
};

export const CustomReactPlayer: FC<CustomReactPlayerProps> = ({
  size = 'default',
  ...props
}) => {
  const lang = useAppSelector(selectLanguage);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <VideoPlaybackError>
        {lang.strings.errors.videoPlaybackError}
      </VideoPlaybackError>
    );
  }

  return (
    <ReactPlayer
      {...props}
      {...sizeMap[size]}
      onError={() => setError(true)}
      onReady={() => setError(false)}
    />
  );
};

CustomReactPlayer.defaultProps = {
  size: 'default',
};
