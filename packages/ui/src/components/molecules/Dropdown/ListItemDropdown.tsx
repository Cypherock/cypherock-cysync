import React, { ReactNode, useEffect } from 'react';
import { DefaultTheme, styled } from 'styled-components';

import { LangDisplay, RadioButton, Typography } from '../../atoms';

interface ListItemDropdownProps {
  text?: string;
  icon?: ReactNode;
  displayNode?: ReactNode;
  checkType?: string;
  checked: boolean;
  onChange: () => void;
  focused?: boolean;
  id: string;
}

const LocalTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.muted};
  text-overflow: ellipsis;
`;

interface ItemsProps {
  checked: boolean;
  $isFocused?: boolean;
}

const getBackgroundColor = (
  theme: DefaultTheme,
  checked: boolean,
  $isFocused?: boolean,
) => {
  if ($isFocused || checked) {
    return theme.palette.background.dropdownHover;
  }
  return theme.palette.background.separatorSecondary;
};

const Items = styled.div<ItemsProps>`
  display: flex;
  padding: 12px 24px;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.background.separator};
  width: 100%;
  cursor: pointer;
  background: ${({ theme, checked, $isFocused }) =>
    getBackgroundColor(theme, checked, $isFocused)};
  ${LocalTypography} {
    color: ${({ $isFocused, theme }) =>
      $isFocused ? theme.palette.text.white : theme.palette.text.muted};
  }
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.dropdownHover};
    ${LocalTypography} {
      color: ${({ theme }) => theme.palette.text.white};
    }
  }
  outline: none;

  &:focus {
    outline: none;
  }
`;

export const ListItemDropdown: React.FC<ListItemDropdownProps> = ({
  text,
  icon,
  checkType,
  checked,
  onChange,
  focused = false,
  id,
  displayNode,
}) => {
  const handleBoxClick = () => {
    if (checkType && checkType === 'radio') {
      onChange();
    }
  };

  useEffect(() => {
    if (focused) {
      const divElement = document.getElementById(`${id}`);
      divElement?.focus();
    }
  }, [focused, text]);

  return (
    <Items
      onClick={handleBoxClick}
      checked={checked}
      $isFocused={focused}
      tabIndex={0}
      id={id}
    >
      {checkType && checkType === 'radio' && <RadioButton checked={checked} />}

      {displayNode ?? (
        <>
          {icon}
          {text && (
            <LocalTypography>
              <LangDisplay text={text} />
            </LocalTypography>
          )}
        </>
      )}
    </Items>
  );
};

ListItemDropdown.defaultProps = {
  checkType: '',
  focused: false,
  icon: undefined,
  displayNode: undefined,
  text: undefined,
};
