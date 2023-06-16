import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Image, LangDisplay, textColorType, Typography } from '../atoms';
import { theme } from '../../themes/theme.styled';
import { shieldAlert, infoIcon } from '../../assets';
import { utils, UtilsProps } from '../utils';

export type AlertBoxVariantType = 'warning' | 'info' | 'none';

export interface AlertBoxProps extends UtilsProps {
  alert: string;
  imageSrc?: string;
  variant?: AlertBoxVariantType;
}

const maskBaseStyle = css<Omit<AlertBoxProps, 'imageSrc' | 'alert'>>`
  ${props => {
    if (props.variant === 'warning')
      return css`
        background: ${() => theme.palette.background.input};
        border-width: 1px;
        border-style: solid;
        border-color: ${() => theme.palette.border.warning};
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
      `;
    if (props.variant === 'info')
      return css`
        background: ${() => theme.palette.background.input};
        border-width: 1px;
        border-style: solid;
        border-color: ${() => theme.palette.border.input};
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
      `;
    if (props.variant === 'none')
      return css`
        background: transparent;
        border: none;
        padding: 0;
      `;
    return '';
  }}
`;

const MaskStyle = styled.div<Omit<AlertBoxProps, 'imageSrc' | 'alert'>>`
  width: 100%;
  position: relative;
  border-radius: 8px;
  background: ${theme.palette.background.input};
  display: flex;
  border: 1px solid ${theme.palette.border.input};
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  ${maskBaseStyle},
  ${utils}
`;

const imageObj: Record<AlertBoxVariantType, string> = {
  warning: infoIcon,
  info: shieldAlert,
  none: shieldAlert,
};

const textObj: Record<AlertBoxVariantType, textColorType> = {
  warning: 'warning',
  info: 'info',
  none: 'info',
};

export const AlertBox: FC<AlertBoxProps> = ({ imageSrc, alert, ...props }) => {
  const variantCurr = props.variant ? props.variant : 'none';
  const imageSource = !imageSrc ? shieldAlert : imageObj[variantCurr];

  return (
    <MaskStyle {...props}>
      <Image width="20" mr="20" src={imageSource} alt="Alert" />
      <Typography variant="p" color={textObj[variantCurr]}>
        <LangDisplay text={alert} />
      </Typography>
    </MaskStyle>
  );
};

AlertBox.defaultProps = {
  variant: 'none',
  imageSrc: shieldAlert,
};
