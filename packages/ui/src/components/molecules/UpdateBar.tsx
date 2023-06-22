import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Typography, Flex, Image } from '../atoms';
import { successIcon } from '../../assets';

interface UpdateBarProps {
  textNormal: string;
  textProgress: string;
  textError: string;
  textSuccess: string;
  buttonNormal: string;
  buttonError: string;
  buttonSuccess?: string;
  progress?: number;
  icon: string;
  iconError?: string;
}

const UpdateBarWrap = styled.div`
  width: 100%;
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

const UpdateBarButton = styled.button`
  background: none;
  outline: none;
  border: none;
  &:hover {
    filter: brightness(150%);
    cursor: pointer;
  }
`;

export const UpdateBar: FC<UpdateBarProps> = ({
  textNormal,
  textProgress,
  textSuccess,
  textError,
  buttonNormal,
  buttonError,
  buttonSuccess,
  progress,
  icon,
  iconError,
}) => {
  // states
  const [updateStatus, setUpdateStatus] = useState('normal');

  const cycleStatus = () => {
    switch (updateStatus) {
      case 'error':
      case 'normal':
        setUpdateStatus('progress');
        break;

      default:
    }
  };

  const progressM = (progress && (progress >= 100 ? 100 : progress)) || 0;

  return (
    <UpdateBarWrap>
      <Flex justify="space-between">
        <Flex gap={16}>
          <Image
            alt="update"
            width={16}
            src={
              {
                normal: icon,
                progress: icon,
                success: successIcon,
                error: iconError ?? icon,
              }[updateStatus]
            }
          />

          <Typography
            color={
              updateStatus === 'success' || updateStatus === 'error'
                ? updateStatus
                : 'heading'
            }
          >
            {
              {
                normal: textNormal,
                progress: textProgress,
                success: textSuccess,
                error: textError,
              }[updateStatus]
            }
          </Typography>
        </Flex>
        {(updateStatus !== 'success' || buttonSuccess) && (
          <UpdateBarButton
            onClick={cycleStatus}
            disabled={updateStatus === 'progress'}
          >
            <Typography color="gold">
              {
                {
                  normal: buttonNormal,
                  progress: `${progress}%`,
                  success: buttonSuccess,
                  error: buttonError,
                }[updateStatus]
              }
            </Typography>
          </UpdateBarButton>
        )}
      </Flex>
      {updateStatus === 'progress' && (
        <UpdateBarWrapProgress progress={progressM} />
      )}
    </UpdateBarWrap>
  );
};

UpdateBar.defaultProps = {
  buttonSuccess: undefined,
  progress: 0,
  iconError: undefined,
};
