import React, { FC } from 'react';

import { Count, FilterMenuDesignWrapper } from './FilterStyles';

import { FilterIcon, TriangleInverseIcon } from '../../../assets';
import { Flex, Typography } from '../../atoms';

interface FilterMenuDesignProps {
  countMenuSelected: number;
  onClick: () => void;
}

export const FilterMenuDesign: FC<FilterMenuDesignProps> = ({
  countMenuSelected,
  onClick,
}) => (
  <FilterMenuDesignWrapper as="div" onClick={onClick}>
    <Flex gap={16} align="center">
      <FilterIcon />
      <Typography color="muted">Filters</Typography>
      {countMenuSelected > 0 && (
        <Count>
          <Typography $fontSize={12} $fontWeight="medium" color="black">
            {countMenuSelected}
          </Typography>
        </Count>
      )}
    </Flex>
    <TriangleInverseIcon />
  </FilterMenuDesignWrapper>
);
