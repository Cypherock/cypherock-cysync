import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { addKeyboardEvents } from '../../../hooks';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  BgColorProps, // No longer needed for DialogBoxStyle background
  DisplayProps,
  FlexProps,
  HeightProps,
  PositionProps,
  SpacingProps,
  WidthProps,
  bgColor, // No longer needed for DialogBoxStyle background
  display,
  flex,
  height,
  position,
  spacing,
  width,
} from '../../utils'; // Assuming bgColor utility handles other $bgColor props correctly

export interface DialogBoxUtilityProps
  extends WidthProps,
    HeightProps,
    FlexProps,
    DisplayProps,
    SpacingProps,
    PositionProps,
    // BgColorProps, // Can be removed if DialogBoxStyle no longer uses $bgColor directly for its main background
    DisplayProps {
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

  /* MODIFICATION: Conditional background */
  background: ${() =>
    (window as any).cysyncEnv?.VENDOR === 'odix'
      ? '#141414' // Odix solid dark grey
      : ({ theme }) => theme.palette.background.primary}; // Default from theme

  /* Conditional border color if it should also change for Odix */
  border-color: ${() =>
    (window as any).cysyncEnv?.VENDOR === 'odix'
      ? '#141414' // Odix border to match background
      : ({ theme }) => theme.palette.border.popup}; // Default from theme

  /* Conditional shadow if it should also change for Odix */
  box-shadow: ${() =>
    (window as any).cysyncEnv?.VENDOR === 'odix'
      ? '4px 4px 32px 4px rgba(15, 13, 11, 1)' // Odix shadow
      : ({ theme }) => theme.shadow.popup}; // Default from theme

  text-align: center;
  ${props => props.$isModal && modalCss}
  ${flex}
  ${display}
  ${width}
  ${height}
  ${spacing}
  ${position} /* ${bgColor} // Removed if $bgColor prop on DialogBox is not meant to override this conditional logic */
`;

const DialogBoxHeaderBarStyle = styled.div<DialogBoxUtilityProps>`
  padding-left: 32px;
  padding-right: 32px;
  border-bottom: 1px;
  display: flex;
  position: relative;
  justify-content: center;
  /* position: relative; // Duplicate */
  width: 100%;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  /* Conditional border color for header if needed, or keep it consistent with dialog border */
  border-color: ${() =>
    (window as any).cysyncEnv?.VENDOR === 'odix'
      ? '#141414' // Odix border for header
      : ({ theme }) => theme.palette.border.popup}; // Default from theme
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
  /* padding-bottom: ${({ theme }) =>
    theme.spacing.two
      .spacing}; // This might be redundant with overall padding */
  position: relative;

  ${flex}
  ${width}
  ${height}
  ${spacing} // ${bgColor} // If DialogBoxBody can have its own $bgColor prop
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
  /* Conditional border color for footer if needed */
  border-color: ${() =>
    (window as any).cysyncEnv?.VENDOR === 'odix'
      ? '#141414' // Odix border for footer
      : ({ theme }) => theme.palette.border.popup}; // Default from theme
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
