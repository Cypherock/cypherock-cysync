import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { addKeyboardEvents } from '../../../hooks';
import {
  BgColorProps,
  DisplayProps,
  FlexProps,
  HeightProps,
  PositionProps,
  SpacingProps,
  WidthProps,
  bgColor,
  display,
  flex,
  height,
  position,
  spacing,
  width,
} from '../../utils';

export interface DialogBoxUtilityProps
  extends WidthProps,
    HeightProps,
    FlexProps,
    DisplayProps,
    SpacingProps,
    PositionProps,
    DisplayProps,
    BgColorProps {
  children?: ReactNode;
  overflowY?: string;
}

export interface DialogBoxProps extends DialogBoxUtilityProps {
  $isModal?: boolean;
  onClose?: () => void;
  dontCloseOnEscape?: boolean;
}

const modalCss = css`
  z-index: 100;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
`;

const DialogBoxStyle = styled.section<DialogBoxProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  /* overflow-y: scroll; */
  background-image: ${({ theme }) => theme.palette.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.popup};
  border-color: ${({ theme }) => theme.palette.border.popup};
  text-align: center;
  ${props => props.$isModal && modalCss}
  ${flex}
  ${display}
  ${width}
  ${height}
  ${spacing}
  ${position}
  ${bgColor}
`;

const DialogBoxHeaderBarStyle = styled.div<DialogBoxUtilityProps>`
  padding-left: 32px;
  padding-right: 32px;
  border-bottom: 1px;
  display: flex;
  position: relative;
  justify-content: center;
  position: relative;
  width: 100%;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.border.popup};
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: ${({ theme }) => theme.palette.text.muted};
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

const DialogBoxBodyStyle = styled.div<DialogBoxUtilityProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  /* overflow-y: scroll; */
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 32px;
  padding-bottom: 32px;
  gap: 32px;

  overflow: visible;

  ${({ overflowY }) =>
    overflowY &&
    css`
      overflow-y: ${overflowY};
    `}
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  position: relative;

  ${flex}
  ${width}
  ${height}
  ${spacing}
  ${bgColor}
`;

const DialogBoxFooterStyle = styled.div<DialogBoxUtilityProps>`
  width: 100%;
  padding: 32px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top: 1px;
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.border.popup};
  gap: ${({ theme }) => theme.spacing.two.spacing};
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

export const DialogBox: FC<DialogBoxProps> = ({
  children,
  onClose,
  dontCloseOnEscape,
  ...props
}) => {
  const onEscape = (e: KeyboardEvent) => {
    if (!dontCloseOnEscape && onClose) {
      (onClose as any)(e);
      e.stopPropagation();
    }
  };

  addKeyboardEvents({
    Escape: onEscape,
  });

  return (
    <>
      {props.$isModal && <ModalOverlay />}
      <DialogBoxStyle {...props}>{children}</DialogBoxStyle>
    </>
  );
};

export const DialogBoxHeader: FC<DialogBoxUtilityProps> = ({
  children,
  ...props
}) => (
  <DialogBoxHeaderBarStyle {...props}> {children} </DialogBoxHeaderBarStyle>
);

export const DialogBoxBody: FC<DialogBoxUtilityProps> = ({
  children,
  ...props
}) => <DialogBoxBodyStyle {...props}>{children}</DialogBoxBodyStyle>;

export const DialogBoxFooter: FC<DialogBoxUtilityProps> = ({
  children,
  ...props
}) => <DialogBoxFooterStyle {...props}>{children}</DialogBoxFooterStyle>;

DialogBox.defaultProps = {
  children: undefined,
  $isModal: false,
  overflowY: undefined,
  dontCloseOnEscape: undefined,
  onClose: undefined,
};

DialogBoxBody.defaultProps = {
  children: undefined,
  overflowY: undefined,
};

DialogBoxFooter.defaultProps = {
  children: undefined,
  overflowY: undefined,
};

DialogBoxHeader.defaultProps = {
  children: undefined,
  overflowY: undefined,
};
