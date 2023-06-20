import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { Typography } from '../atoms';

interface ProgressBarProps {
  versionText: string | undefined;
  progress: number;
}

const HolderStyle = styled.div`
  width: 110%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  margin-top: 25px;
  margin-bottom: -30px;
`;

const VersionHolder = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  padding: 5px;
`;

const MaskStyle = styled.div`
  width: 100%;
  height: 17px;
  position: relative;
  border-radius: 50px;
  background: ${({ theme }) => theme.palette.golden};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundStyle = styled.div`
  height: calc(100% - 4px);
  width: calc(100% - 4px);
  border-radius: 50px;
  background: ${({ theme }) => theme.palette.background.primary};
`;
const FillerStyle = styled.div<{ progress: number }>`
  height: 102%;
  width: ${({ progress }) => progress}%;
  top: 0;
  left: -1px;
  position: absolute;
  background: ${({ theme }) => theme.palette.golden};
  border-radius: inherit;
  border-bottom-right-radius: ${({ progress }) =>
    progress === 100 ? 50 : 0}px;
  border-top-right-radius: ${({ progress }) => (progress === 100 ? 50 : 0)}px;
`;

export const ProgressBar: FC<ProgressBarProps> = ({
  versionText,
  progress,
}): ReactElement => (
  <HolderStyle>
    {versionText && (
      <VersionHolder>
        <Typography variant="h6" $textAlign="center" color="muted">
          {versionText}
        </Typography>
      </VersionHolder>
    )}
    <MaskStyle>
      <BackgroundStyle>
        <FillerStyle progress={progress} />
      </BackgroundStyle>
    </MaskStyle>
    <Typography variant="h6" $textAlign="center" color="muted">
      {progress}%
    </Typography>
  </HolderStyle>
);
