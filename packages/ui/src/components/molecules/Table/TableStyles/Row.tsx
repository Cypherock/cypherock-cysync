import styled from 'styled-components';

import { UtilsProps, utils } from '../../../utils';

const buttonAnimationData = {
  duration: '0.3s',
  curve: 'ease-out',
};

export const RowWrapper = styled.div<{
  $rowIndex: number;
  $subMenu?: boolean;
  $hasSubMenu?: boolean;
  $isLast?: boolean;
  $height: string;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: inherit;
  background: ${({ theme, $rowIndex }) =>
    $rowIndex % 2 !== 0
      ? theme.palette.background.stripe
      : theme.palette.background.content};
  max-height: ${({ $subMenu }) => ($subMenu ? '0' : 'auto')};
  height: ${({ $height }) => $height};
  min-height: ${({ $height }) => $height};
  overflow: hidden;
  transition: max-height 0.5s ease-out, opacity 0.5s ease-out;

  ${({ $hasSubMenu, theme, $rowIndex, $subMenu }) =>
    !$hasSubMenu &&
    !$subMenu &&
    `border-bottom: 1px solid
      ${
        $rowIndex % 2 !== 0
          ? theme.palette.border.table.stripe
          : theme.palette.border.table.row
      };
    `}

  ${({ $isLast, $hasSubMenu }) =>
    $isLast && !$hasSubMenu && `border-radius: 0 0 24px 24px`};

  ${({ theme, $isLast, $hasSubMenu }) =>
    `
        &:hover {  
          &::before {
              content: '';
              position: absolute;
              inset: 0;
              border: 1px solid transparent;
              ${$isLast && !$hasSubMenu && `border-radius: 0 0 24px 24px`};
              background: ${theme.palette.golden};
              -webkit-mask: linear-gradient(#fff 0 0) padding-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
            }
        
            &:hover::before {
              background: ${theme.palette.golden} border-box;
              transition: all ${buttonAnimationData.duration};
              ${buttonAnimationData.curve};
            }
          cursor: pointer;
        }
        &:focus { 
          outline: none;
          background: ${theme.palette.golden};
        }
      `}
`;

export const RowContainer = styled.div<UtilsProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: inherit;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  ${utils}
`;

export const RowBackground = styled.div<{
  $rowIndex: number;
  $isLast?: boolean;
}>`
  background: ${({ theme, $rowIndex }) =>
    $rowIndex % 2 !== 0
      ? theme.palette.background.stripe
      : theme.palette.background.content};
  ${({ $isLast }) => $isLast && `border-radius: 0 0 24px 24px`};
`;
