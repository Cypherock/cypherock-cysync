import React, { FC, ReactElement } from 'react';
import { theme } from '../../themes/theme.styled';
import { Typography } from '../atoms';

interface ProgressBarProps {
  versionText: string | undefined;
  progress: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  versionText,
  progress,
}): ReactElement => {
  const holder = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
    width: '110%',
    height: '100%',
    position: 'relative',
    flexDirection: 'column',
    marginTop: '25px',
    marginBottom: -30,
  } as React.CSSProperties;

  const versionStyle = {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'start',
    width: '100%',
    padding: 5,
  } as React.CSSProperties;

  const mask = {
    height: '17px',
    width: '100%',
    position: 'relative',
    borderRadius: 50,
    background: theme.palette.golden,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties;

  const background = {
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 4px)',
    borderRadius: 50,
    background: theme.palette.background.primary,
  } as React.CSSProperties;

  const fillerStyles = {
    height: '102%',
    width: `${progress}%`,
    top: 0,
    left: -1,
    position: 'absolute',
    background: theme.palette.golden,
    borderRadius: 'inherit',
    borderBottomRightRadius: progress === 100 ? 50 : 0,
    borderTopRightRadius: progress === 100 ? 50 : 0,
  } as React.CSSProperties;

  return (
    <div style={holder}>
      {versionText && (
        <div style={versionStyle}>
          <Typography variant="h6" $textAlign="center" color="muted">
            {versionText}
          </Typography>
        </div>
      )}
      <div style={mask}>
        <div style={background}>
          <div style={fillerStyles} />
        </div>
      </div>
      <Typography variant="h6" $textAlign="center" color="muted">
        {progress}%
      </Typography>
    </div>
  );
};
