import React from 'react';
import { styled } from 'styled-components';

import { LangDisplay, RadioButton, Typography } from '../../atoms';

interface ListItemDropdownProps {
  text: string;
  checkType?: string;
  checked: boolean;
  onChange: () => void;
}

const LocalTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.muted};
`;

interface ItemsProps {
  checked: boolean;
}

const Items = styled.div<ItemsProps>`
  display: flex;
  padding: 12px 24px;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.background.separator};
  width: 100%;
  cursor: pointer;
  background: ${({ theme, checked }) =>
    checked
      ? theme.palette.background.dropdownHover
      : theme.palette.background.separatorSecondary};
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.dropdownHover};
    ${LocalTypography} {
      color: ${({ theme }) => theme.palette.text.white};
    }
  }
`;

export const ListItemDropdown: React.FC<ListItemDropdownProps> = ({
  text: itemText,
  checkType,
  checked,
  onChange,
}) => {
  const handleBoxClick = () => {
    if (checkType && checkType === 'radio') {
      onChange();
    }
  };

  return (
    <Items onClick={handleBoxClick} checked={checked}>
      {checkType && checkType === 'radio' && <RadioButton checked={checked} />}
      <LocalTypography>
        <LangDisplay text={itemText} />
      </LocalTypography>
    </Items>
  );
};

ListItemDropdown.defaultProps = {
  checkType: '',
};
