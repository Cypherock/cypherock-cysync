import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { spacing, SpacingProps } from '../utils';

export interface BulletProps extends SpacingProps {
  variant?: 'outline' | 'gold' | 'success' | 'failed' | 'muted';
  size?: 'lg' | 'sm' | 'md';
}

const BulletStyle = styled.div<BulletProps>`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.text.heading};

  ${props =>
    props.size === 'sm' &&
    css`
      width: 8px;
      height: 8px;
      min-width: 8px;
      min-width: 8px;
    `}
  ${props =>
    props.size === 'lg' &&
    css`
      width: 16px;
      height: 16px;
    `}
  ${props =>
    props.variant === 'outline' &&
    css`
      width: 16px;
      height: 16px;
      border: 2px solid red;
      border-color: ${({ theme }) => theme.palette.text.muted};
      background-color: transparent;
    `}
  ${props =>
    !props.variant &&
    css`
      background-color: ${({ theme }) => theme.palette.bullet.white};
    `}
  ${props =>
    props.variant === 'gold' &&
    css`
      background-image: ${({ theme }) => theme.palette.golden};
    `}
    ${props =>
    props.variant === 'success' &&
    css`
      background-color: ${({ theme }) => theme.palette.success.main};
    `}
    ${props =>
    props.variant === 'failed' &&
    css`
      background-color: ${({ theme }) => theme.palette.warn.main};
    `}
  ${props =>
    props.variant === 'muted' &&
    css`
      background-color: ${({ theme }) => theme.palette.text.muted};
    `}
  ${spacing}
`;

export const Bullet: FC<BulletProps> = ({ ...props }) => (
  <BulletStyle {...props} />
);

Bullet.defaultProps = {
  variant: undefined,
  size: 'sm',
};
