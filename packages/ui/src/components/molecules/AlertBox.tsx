import React, { FC, ReactNode } from 'react';
import styled, { css, useTheme } from 'styled-components';

import { InfoItalicsIcon, shieldAlert } from '../../assets';
import {
  Image,
  LangDisplay,
  TypographyColor,
  Typography,
  Flex,
} from '../atoms';
import { utils, UtilsProps } from '../utils';

export type AlertBoxVariantType =
  | 'message'
  | 'messageSecondary'
  | 'messageTertiary'
  | 'warning'
  | 'info'
  | 'none';

export interface AlertBoxProps
  extends UtilsProps,
    React.ButtonHTMLAttributes<HTMLDivElement> {
  alert?: string;
  subAlert?: string;
  icon?: ReactNode;
  variant?: AlertBoxVariantType;
}

const maskBaseStyle = css<Omit<AlertBoxProps, 'imageSrc' | 'alert'>>`
  ${props => {
    if (props.variant === 'message')
      return css`
        background: ${({ theme }) => theme.palette.background.message};
        border-width: 1px;
        border-style: solid;
        border-color: ${({ theme }) => theme.palette.border.message};
        border-radius: 6px;
        color: ${({ theme }) => theme.palette.text.white};
        font-weight: 500;
      `;
    if (props.variant === 'messageSecondary')
      return css`
        background: ${({ theme }) => theme.palette.background.messageSecondary};
        border-width: 1px;
        border-style: solid;
        border-color: ${({ theme }) => theme.palette.border.messageSecondary};
        border-radius: 6px;
        color: ${({ theme }) => theme.palette.text.white};
        font-weight: 500;
      `;
    if (props.variant === 'messageTertiary')
      return css`
        background: ${({ theme }) => theme.palette.background.input};
        border-width: 1px;
        border-style: solid;
        border-color: ${({ theme }) => theme.palette.border.infoBox};
        border-radius: 6px;
        color: ${({ theme }) => theme.palette.text.white};
        font-weight: 500;
      `;
    if (props.variant === 'warning')
      return css`
        background: ${({ theme }) => theme.palette.background.input};
        border-width: 1px;
        border-style: solid;
        border-color: ${({ theme }) => theme.palette.border.warning};
        border-radius: 6px;
        color: ${({ theme }) => theme.palette.text.white};
        font-weight: 500;
      `;
    if (props.variant === 'info')
      return css`
        background: ${({ theme }) => theme.palette.background.input};
        border-width: 1px;
        border-style: solid;
        border-color: ${({ theme }) => theme.palette.border.input};
        border-radius: 6px;
        color: ${({ theme }) => theme.palette.text.white};
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
  background: ${({ theme }) => theme.palette.background.input};
  display: flex;
  border: 1px solid ${({ theme }) => theme.palette.border.input};
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  ${maskBaseStyle}
  ${utils}
`;

const textObj: Record<AlertBoxVariantType, TypographyColor | undefined> = {
  message: 'message',
  messageSecondary: 'message',
  messageTertiary: 'muted',
  warning: 'warn',
  info: undefined,
  none: undefined,
};

export const AlertBox: FC<AlertBoxProps> = ({
  icon,
  alert,
  subAlert,
  ...props
}) => {
  const variantCurr = props.variant ? props.variant : 'none';

  const theme = useTheme();

  const iconObj: Record<AlertBoxVariantType, React.JSX.Element> = {
    warning: <InfoItalicsIcon fill={theme?.palette.text.warn} />,
    messageSecondary: <InfoItalicsIcon fill={theme?.palette.text.warn} />,
    messageTertiary: <InfoItalicsIcon fill={theme?.palette.text.white} />,
    message: <InfoItalicsIcon fill={theme?.palette.text.success} />,
    info: <Image $width="20" src={shieldAlert} alt="alert" />,
    none: <Image $width="20" src={shieldAlert} alt="alert" />,
  };

  return (
    <MaskStyle {...props}>
      <Flex mr="20">{icon ?? iconObj[variantCurr]}</Flex>
      <Flex direction="column">
        {alert && (
          <Typography variant="fineprint" color={textObj[variantCurr]}>
            <LangDisplay text={alert} />
          </Typography>
        )}
        {subAlert && (
          <Typography variant="fineprint" color="muted">
            <LangDisplay text={subAlert} />
          </Typography>
        )}
      </Flex>
    </MaskStyle>
  );
};

AlertBox.defaultProps = {
  variant: 'info',
  icon: undefined,
  alert: undefined,
  subAlert: undefined,
};
