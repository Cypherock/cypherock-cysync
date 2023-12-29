import React, { ReactNode } from 'react';

import { GraphIcon, GraphSwitchIcon } from '../../../assets';
import { Container, Typography, Button } from '../../atoms';
import { Dropdown } from '../Dropdown';
import { DropDownItemProps } from '../DropDownItem';

export interface GraphHeaderProps {
  title: string;
  subTitle?: string;
  conversionRate?: string;
  dropdownItems?: DropDownItemProps[];
  selectedDropdownItem?: string;
  onDropdownChange?: (id: string | undefined) => void;
  dropdownLeftImage?: ReactNode;
  dropdownPlaceholderText?: string;
  dropdownSearchText?: string;
  selectedPill?: string;
  pillButtonList?: { text: string; id: string }[];
  onPillButtonChange?: (id: string) => void;
  onSwitch?: () => void;
  isLoading?: boolean;
}

export const GraphHeader: React.FC<GraphHeaderProps> = ({
  title,
  subTitle,
  conversionRate,
  dropdownItems,
  selectedDropdownItem,
  onDropdownChange,
  dropdownLeftImage,
  dropdownPlaceholderText,
  dropdownSearchText,
  selectedPill,
  onPillButtonChange,
  pillButtonList,
  onSwitch,
  isLoading,
}) => {
  const showDropdown = dropdownItems && onDropdownChange;

  return (
    <Container
      direction="row"
      justify="space-between"
      height="full"
      pt={4}
      px={{ def: 3, lg: 5 }}
      pb={2}
      $borderColor="popup"
      $borderWidthB={1}
      $borderStyle="solid"
    >
      <Container width="full" justify="flex-start">
        <Container
          pb="4"
          display="flex"
          direction="column"
          align="flex-start"
          justify="flex-start"
        >
          <Container direction="row">
            <Typography
              variant="h3"
              $textAlign="left"
              $fontSize={32}
              $fontWeight="bold"
              mr={2}
            >
              {title}
            </Typography>
            {onSwitch && (
              <Button variant="icon" onClick={onSwitch} disabled={isLoading}>
                <GraphSwitchIcon />
              </Button>
            )}
          </Container>

          {subTitle && (
            <Container direction="row">
              <Typography
                $textAlign="left"
                $fontSize={16}
                color="muted"
                mr={3}
                $letterSpacing="0.8px"
                $fontWeight="medium"
              >
                {subTitle}
              </Typography>
              <Container
                display={conversionRate ? 'flex' : 'none'}
                direction="row"
              >
                <GraphIcon mr={1} />
                <Typography
                  $textAlign="left"
                  $fontSize={16}
                  $fontWeight="medium"
                  color="muted"
                  $letterSpacing="0.8px"
                >
                  {conversionRate}
                </Typography>
              </Container>
            </Container>
          )}
        </Container>
      </Container>

      <Container display="flex" direction={{ def: 'column', mdlg: 'row' }}>
        {pillButtonList && onPillButtonChange && (
          <Container
            gap={8}
            align-items="center"
            mr={{ def: 0, mdlg: showDropdown ? 3 : 0 }}
            mb={{ def: showDropdown ? 3 : 0, mdlg: 0 }}
          >
            {pillButtonList.map(item => (
              <Button
                variant={
                  item.id === selectedPill ? 'secondary' : 'secondaryLight'
                }
                size="sm"
                onClick={() => onPillButtonChange(item.id)}
                disabled={isLoading}
                key={item.id}
              >
                {item.text}
              </Button>
            ))}
          </Container>
        )}
        {showDropdown && (
          <Container $noFlex width={220}>
            <Dropdown
              align-items="center"
              justify-content="space-between"
              items={dropdownItems}
              selectedItem={selectedDropdownItem}
              disabled={isLoading}
              searchText={dropdownSearchText ?? ''}
              placeholderText={dropdownPlaceholderText ?? ''}
              onChange={onDropdownChange}
              leftImage={dropdownLeftImage}
            />
          </Container>
        )}
      </Container>
    </Container>
  );
};

GraphHeader.defaultProps = {
  subTitle: undefined,
  conversionRate: undefined,
  dropdownItems: undefined,
  selectedDropdownItem: undefined,
  onDropdownChange: undefined,
  dropdownLeftImage: undefined,
  dropdownPlaceholderText: undefined,
  dropdownSearchText: undefined,
  selectedPill: undefined,
  onPillButtonChange: undefined,
  pillButtonList: undefined,
  onSwitch: undefined,
  isLoading: undefined,
};
