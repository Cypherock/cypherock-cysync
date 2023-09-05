import React, { FC } from 'react';
import { styled } from 'styled-components';

import {
  SkeletonLoading,
  SkeletonLoadingLeft,
  SkeletonLoadingRight,
} from '../../assets';
import { Button, Flex, Typography } from '../atoms';

interface NoAccountWrapperProps {
  $hasCustomStyles?: boolean;
}

export const NoAccountWrapper = styled.div<NoAccountWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: ${({ $hasCustomStyles }) => ($hasCustomStyles ? '0' : '24px')};
  background: transparent;
  box-shadow: ${({ theme }) => theme.palette.shadow.popup};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NoAccountLoader = styled.div`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.row};
  background: ${({ theme }) => theme.palette.background.content};
`;

const LeftLoaderContainer = styled.div`
  display: flex;
  padding: 16px 40px;
  align-items: center;
  gap: 24px;
`;

const RightLoaderContainer = styled.div`
  display: flex;
  padding: 16px 20px 16px 40px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;

const LoaderContainer = styled.div`
  display: flex;
  padding: 16px 20px 16px 40px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

interface SkeletonLoaderProps {
  loader: React.ReactNode;
  $noLoaderContainer?: boolean;
  text?: string;
  subText?: string;
  $buttonOne?: string;
  $buttonTwo?: string;
  onClick?: () => void;
  onClickTwo?: () => void;
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  loader,
  text,
  subText,
  $buttonOne,
  $buttonTwo,
  $noLoaderContainer,
  onClick,
  onClickTwo,
}) => (
  <>
    {$noLoaderContainer ? (
      loader
    ) : (
      <NoAccountLoader>
        <LeftLoaderContainer>
          {loader}
          <SkeletonLoadingLeft />
        </LeftLoaderContainer>
        <LoaderContainer>
          <SkeletonLoading />
        </LoaderContainer>
        <RightLoaderContainer>
          <SkeletonLoadingRight />
        </RightLoaderContainer>
      </NoAccountLoader>
    )}
    <Flex direction="column" gap={16} align="center">
      <Typography $fontSize={24} $fontWeight="medium">
        {text}
      </Typography>
      <Typography $fontSize={16} color="muted">
        {subText}
      </Typography>
    </Flex>
    <Flex gap={24}>
      <Button variant="primary" onClick={onClick}>
        {$buttonOne}
      </Button>
      {$buttonTwo && (
        <Button variant="primary" onClick={onClickTwo}>
          {$buttonTwo}
        </Button>
      )}
    </Flex>
  </>
);

SkeletonLoader.defaultProps = {
  text: '',
  subText: '',
  $buttonOne: '',
  $buttonTwo: '',
  $noLoaderContainer: undefined,
  onClick: undefined,
  onClickTwo: undefined,
};
