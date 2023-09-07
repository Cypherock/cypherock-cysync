import React, { ReactNode } from 'react';

import { Container, Typography, Button } from '../../atoms';
import { Dropdown } from '../Dropdown';
import { DropDownListItemProps } from '../DropDownListItem';

export interface GraphHeaderProps {
  title: string;
  subTitle?: string;
  dropdownItems?: DropDownListItemProps[];
  selectedDropdownItem?: string;
  onDropdownChange?: (id: string | undefined) => void;
  dropdownLeftImage?: ReactNode;
  dropdownPlaceholderText?: string;
  dropdownSearchText?: string;
  selectedPill?: string;
  pillButtonList?: { text: string; id: string }[];
  onPillButtonChange?: (id: string) => void;
}

export const GraphHeader: React.FC<GraphHeaderProps> = ({
  title,
  subTitle,
  dropdownItems,
  selectedDropdownItem,
  onDropdownChange,
  dropdownLeftImage,
  dropdownPlaceholderText,
  dropdownSearchText,
  selectedPill,
  onPillButtonChange,
  pillButtonList,
}) => (
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
        align-items="flex-start"
        justify="flex-start"
      >
        <Typography
          variant="h3"
          $textAlign="left"
          $fontSize={32}
          $fontWeight="bold"
        >
          {title}
        </Typography>

        {subTitle && (
          <Typography $textAlign="left" $fontSize={16} color="muted">
            {subTitle}
          </Typography>
        )}
      </Container>
    </Container>

    <Container display="flex" direction={{ def: 'column', mdlg: 'row' }}>
      {pillButtonList && onPillButtonChange && (
        <Container
          gap={8}
          align-items="center"
          mr={{ def: 0, mdlg: 3 }}
          mb={{ def: 3, mdlg: 0 }}
        >
          {pillButtonList.map(item => (
            <Button
              variant={
                item.id === selectedPill ? 'secondary' : 'secondaryLight'
              }
              size="sm"
              onClick={() => onPillButtonChange(item.id)}
              key={item.id}
            >
              {item.text}
            </Button>
          ))}
        </Container>
      )}
      {dropdownItems && onDropdownChange && (
        <Container $noFlex width={200}>
          <Dropdown
            align-items="center"
            justify-content="space-between"
            items={dropdownItems}
            selectedItem={selectedDropdownItem}
            disabled={false}
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

GraphHeader.defaultProps = {
  subTitle: undefined,
  dropdownItems: undefined,
  selectedDropdownItem: undefined,
  onDropdownChange: undefined,
  dropdownLeftImage: undefined,
  dropdownPlaceholderText: undefined,
  dropdownSearchText: undefined,
  selectedPill: undefined,
  onPillButtonChange: undefined,
  pillButtonList: undefined,
};
