import React, { FC } from 'react';
import styled from 'styled-components';

import { BreadcrumbDropdown, BreadcrumbDropdownProps } from './Dropdown';

import { Button, Flex, Typography, Tooltip } from '../../atoms';
import { useOverflow } from '../../../hooks';

export interface BreadcrumbItem {
  id: string;
  onClick?: () => void;
  text?: string;
  dropdown?: BreadcrumbDropdownProps;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const CustomTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.background.breadcrumbSeparator};
`;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

interface BreadcrumbTextProps {
  text: string;
  onClick?: () => void;
}

const BreadcrumbText: FC<BreadcrumbTextProps> = ({ text, onClick }) => {
  const { ref, isOverflowing } = useOverflow({ ofChild: true });

  const typography = (
    <Typography
      $fontSize={16}
      $fontWeight="medium"
      color="muted"
      $textOverflow="ellipsis"
      $whiteSpace="nowrap"
      $maxWidth="10vw"
    >
      {text}
    </Typography>
  );

  const content = (
    <Tooltip text={text} isActive={isOverflowing}>
      <div ref={ref}>{typography}</div>
    </Tooltip>
  );

  if (onClick) {
    return (
      <Button variant="text" onClick={onClick}>
        {content}
      </Button>
    );
  }

  return content;
};

BreadcrumbText.defaultProps = {
  onClick: undefined,
};

export const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => (
  <Flex direction="column" gap={20} justify="center">
    <DropdownContainer>
      <Flex gap={12} align="center">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.text && (
              <BreadcrumbText text={item.text} onClick={item.onClick} />
            )}
            {item.dropdown && <BreadcrumbDropdown {...item.dropdown} />}

            {index < items.length - 1 && (
              <CustomTypography $fontSize={16} $fontWeight="medium">
                /
              </CustomTypography>
            )}
          </React.Fragment>
        ))}
      </Flex>
    </DropdownContainer>
  </Flex>
);
