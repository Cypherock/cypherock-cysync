import { css, styled } from 'styled-components';

import { CursorProps, UtilsProps, cursor, utils } from '../../utils';

const positionAbsolute = css`
  position: absolute;
  top: 100%;
  right: 0;
`;

export const DropDownListContainer = styled.div<
  UtilsProps & { $isSelfPositioned?: boolean }
>`
  ${({ $isSelfPositioned }) => !$isSelfPositioned && positionAbsolute}
  width: 100%;
  list-style: none;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: ${({ theme }) => theme.shadow.popup};
  padding: 16px 0px 16px 0px;
  z-index: 10;
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  ${utils}
`;

export const DropdownListItem = styled.div<
  CursorProps & { $isFocused?: boolean }
>`
  background-color: ${({ theme }) => theme.palette.border.separatorSecondary};
  ${cursor}
`;

export const DropdownContainer = styled.div<{
  $isOpen: boolean;
  disabled?: boolean;
}>`
  position: relative;
  width: 100%;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.border.separatorSecondary};
  padding: 1px;
  ${({ disabled, theme }) =>
    !disabled &&
    `
        &:hover {  
          &::before {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 8px;
              border: 1px solid transparent;
              background: ${theme.palette.silver};
              -webkit-mask: linear-gradient(#fff 0 0) padding-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
            }
          cursor: pointer;
        }
      `}
  &:focus {
    ${({ disabled, theme }) =>
      !disabled &&
      `
      outline: none;
      border: 0px solid transparent;
      background: ${theme.palette.golden};
  
      &::before {
        background: ${theme.palette.golden};
      }
      `}
  }
  & > input {
    padding-right: 30px;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 24px;
  padding-bottom: 8px;
  top: 60%;
  transform: translateY(-50%);
`;
