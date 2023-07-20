import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Typography, Flex, Button } from '../atoms';

export type UpdateState = 'normal' | 'progress' | 'success' | 'error';

interface UpdateBarProps {
  text: ReactNode;
  buttonText?: ReactNode;
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  progress?: number;
  icon?: ReactNode;
  state?: UpdateState;
}

const UpdateBarWrap = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;
  height: ${({ theme }) => theme.spacing.five.spacing};
  padding-top: ${({ theme }) => theme.spacing.one.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
  padding-left: ${({ theme }) => theme.spacing.two.spacing};
  padding-right: ${({ theme }) => theme.spacing.two.spacing};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  background: ${({ theme }) => theme.palette.background.bar};
  border-color: ${({ theme }) => theme.palette.border.bar};
  border-width: 1px;
  border-style: solid;
`;

const UpdateBarWrapProgress = styled.div<{ progress: number }>`
  position: absolute;
  background: ${({ theme }) => theme.palette.golden};
  border-radius: inherit;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => (props.progress > 100 ? 100 : props.progress)}%;
  transition: 0.1s;
  z-index: -1;
`;

export const UpdateBar: FC<UpdateBarProps> = ({
  text,
  buttonText,
  onButtonClick,
  progress,
  icon,
  state,
}) => {
  const progressM = (progress && (progress >= 100 ? 100 : progress)) || 0;

  return (
    <UpdateBarWrap>
      <Flex justify="space-between">
        <Flex gap={16} align="center">
          {icon}
          <Typography
            color={state === 'success' || state === 'error' ? state : 'heading'}
          >
            {text}
          </Typography>
        </Flex>
        {buttonText && (
          <Button variant="text" onClick={onButtonClick}>
            <Typography color="gold"> {buttonText} </Typography>
          </Button>
        )}
        {state === 'progress' && <Typography>{progressM}%</Typography>}
      </Flex>
      {state === 'progress' && <UpdateBarWrapProgress progress={progressM} />}
    </UpdateBarWrap>
  );
};

UpdateBar.defaultProps = {
  progress: 0,
  buttonText: undefined,
  onButtonClick: undefined,
  icon: undefined,
  state: 'normal',
};
