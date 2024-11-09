import {
  Button,
  Container,
  Image,
  informationWhiteIcon,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

import { selectLanguage, selectNetwork, useAppSelector } from '~/store';

interface VideoPlayerProps extends ReactPlayerProps {
  onRetry: () => void;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ onRetry, ...props }) => {
  const lang = useAppSelector(selectLanguage);
  const [error, setError] = useState(false);
  const { active } = useAppSelector(selectNetwork);

  useEffect(() => {
    if (!active) {
      setError(true);
    }
  }, [active]);

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
            <Button
              variant="text"
              onClick={onRetry}
              style={{
                color: 'white',
                textDecoration: 'underline',
              }}
            >
              {lang.strings.buttons.tryAgain}
            </Button>
          </Typography>
        </Container>
      </Container>
    );
  }

  return <ReactPlayer {...props} onReady={() => setError(false)} />;
};
