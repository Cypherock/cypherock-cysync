import React, { FC } from 'react';
import styled, { css, RuleSet } from 'styled-components';

import { UtilsProps, utils } from '../utils';
import { Image } from './Image';
import { informationWhiteIcon } from '../../assets';

export type VideoPlaybackErrorSize = 'default' | 'big';

export interface VideoPlaybackErrorProps extends UtilsProps {
  children: React.ReactNode;
  size?: VideoPlaybackErrorSize;
}

const videoPlaybackErrorSizeMap: Record<
  VideoPlaybackErrorSize,
  RuleSet<VideoPlaybackErrorProps>
> = {
  default: css<VideoPlaybackErrorProps>`
    width: 720px;
    height: 405px;
  `,
  big: css<VideoPlaybackErrorProps>`
    width: 900px;
    height: 508px;
  `,
};

const videoPlaybackErrorSizeStyle = css<VideoPlaybackErrorProps>`
  ${props => videoPlaybackErrorSizeMap[props.size ?? 'default']}
`;

const StyledVideoPlaybackError = styled.div<VideoPlaybackErrorProps>`
  border-radius: 8px;
  background: #14110f;
  display: flex;
  justify-content: center;
  align-items: center;

  ${videoPlaybackErrorSizeStyle}
  ${utils}
`;

const StyledInfo = styled.div`
  display: flex;
  width: 360px;
  gap: 24px;
  align-items: center;

  color: #fff;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const VideoPlaybackError: FC<VideoPlaybackErrorProps> = ({
  children,
  ...props
}) => (
  <StyledVideoPlaybackError {...props}>
    <StyledInfo>
      <Image
        src={informationWhiteIcon}
        alt="info icon"
        $width={40}
        $height={42}
      />
      <span>{children}</span>
    </StyledInfo>
  </StyledVideoPlaybackError>
);

VideoPlaybackError.defaultProps = {
  size: 'default',
};
