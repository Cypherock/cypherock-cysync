import React, { FC, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { selectLanguage, useAppSelector } from '~/store';
import {
  Container,
  Image,
  informationWhiteIcon,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';

export const VideoPlayer: FC<ReactPlayerProps> = ({ ...props }) => {
  const lang = useAppSelector(selectLanguage);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <Container
        width={props.width}
        height={props.height}
        $borderRadius={8}
        $bgColor="videoError"
      >
        <Container width="360px" gap={24}>
          <Image
            src={informationWhiteIcon}
            alt="info icon"
            $width={40}
            $height={42}
          />
          <Typography color="white">
            <LangDisplay text={lang.strings.errors.videoPlaybackError} />
          </Typography>
        </Container>
      </Container>
    );
  }

  return (
    <ReactPlayer
      {...props}
      onError={() => setError(true)}
      onReady={() => setError(false)}
    />
  );
};
