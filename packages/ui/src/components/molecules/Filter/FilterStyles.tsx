import { styled } from 'styled-components';

import { goldenGradient } from '../../utils';

export interface MenuType {
  checkType: string;
  tag?: string;
  icon?: React.ReactNode;
  name: string;
}

export interface FilterProps {
  menu: string;
  subMenu: MenuType[];
  isToggled: boolean;
  onToggle: () => void;
  checkboxStates: boolean[];
  onCheckboxChange: (subMenuIndex: number) => void;
  selectedCount: number;
  onToggleAllCheckboxes?: () => void;
}

export interface BasicFilter {
  $filterIcon?: React.ReactNode;
  checked?: boolean;
}

export const FilterMenuDesignWrapper = styled.div`
  display: flex;
  max-width: 420px;
  height: 44px;
  padding: 12px 24px;
  justify-content: space-between;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  background: ${({ theme }) => theme.palette.border.separatorSecondary};
  &:hover {
    cursor: pointer;
  }
`;

export const FilterItemWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const FilterLayout = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px 0px;
  border-radius: var(--8-px, 8px);
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  z-index: 1;
`;

export const FilterMenu = styled.div`
  width: 100%;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.separator};

  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: none;
    border-radius: 8px;
  }
`;

export const FilterWrapper = styled.div``;

export const FilterMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  position: relative;
`;

export const Count = styled.div`
  display: flex;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 19px;
  ${goldenGradient('background')};
`;

export const FilterItems = styled.div<BasicFilter>`
  width: 100%;
  padding: 12px 24px 12px 48px;
  display: flex;
  gap: ${({ $filterIcon }) => ($filterIcon ? '24px' : '16px')};
  background: ${({ theme, checked }) =>
    checked
      ? theme.palette.background.dropdownHover
      : theme.palette.background.filterItem};
  &:hover {
    background: ${({ theme }) => theme.palette.background.dropdownHover};
    cursor: pointer;
  }
  &:focus {
    outline: none;
    background: ${({ theme }) => theme.palette.background.dropdownHover};
  }
`;
export const CheckboxWrapper = styled.div.attrs({
  role: 'button',
  tabIndex: 0,
})`
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;
