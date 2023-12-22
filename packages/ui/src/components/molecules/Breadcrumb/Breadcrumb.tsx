import React, { FC } from 'react';
import styled from 'styled-components';

import { BreadcrumbDropdown, BreadcrumbDropdownProps } from './Dropdown';

import { Button, Flex, Typography } from '../../atoms';

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

export const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => (
  <Flex direction="column" gap={20} justify="center">
    <DropdownContainer>
      <Flex gap={12} align="center">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.text && item.onClick && (
              <Button variant="text" onClick={item.onClick}>
                <Typography $fontSize={16} $fontWeight="medium" color="muted">
                  {item.text}
                </Typography>
              </Button>
            )}
            {item.text && !item.onClick && (
              <Typography $fontSize={16} $fontWeight="medium" color="muted">
                {item.text}
              </Typography>
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
