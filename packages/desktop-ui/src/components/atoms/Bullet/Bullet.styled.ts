import styled, { css } from 'styled-components';
import { margin } from '../../util';

export interface BulletProps {
  variant?: 'outline' | 'gold' | 'success' | 'failed' | 'muted';
  size?: 'lg' | 'sm' | 'md';
}

export const BulletStyle = styled.div<BulletProps>`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.text.textHeading};
  ${margin}

  //size
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

  //variant
  ${props =>
    props.variant === 'outline' &&
    css`
      width: 16px;
      height: 16px;
      border: 2px solid red;
      border-color: ${({ theme }) => theme.palette.text.textMuted};
      background-color: transparent;
    `}
  ${props =>
    props.variant === 'gold' &&
    css`
      background-image: ${({ theme }) => theme.palette.primary.primary};
    `}
  ${props =>
    props.variant === 'success' &&
    css`
      background-color: ${({ theme }) => theme.palette.success.main};
    `}
  ${props =>
    props.variant === 'failed' &&
    css`
      background-color: ${({ theme }) => theme.palette.warning.main};
    `}

  ${props =>
    props.variant === 'muted' &&
    css`
      background-color: ${({ theme }) => theme.palette.text.textMuted};
    `}
`;
