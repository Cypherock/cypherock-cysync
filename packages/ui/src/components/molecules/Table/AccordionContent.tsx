import React, { FC } from 'react';
import { styled } from 'styled-components';

import { Typography } from '../../atoms';
import { UtilsProps, utils } from '../../utils';

interface RowItem {
  component: React.ReactNode;
  width?: number;
  padding?: string | number;
  paddingLeft?: string;
}

interface AccordionContentProps {
  id: string;
  items: RowItem[];
  headers: string[];
  $last: boolean;
  $hasBorder?: boolean;
}

interface FlexContainerProps extends UtilsProps {
  padding?: string | number;
}

const AccordionContainer = styled.div<AccordionContentProps>`
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  flex: 1;
  border-bottom-right-radius: ${({ $last }) => ($last ? '24px' : '0')};
  border-bottom-left-radius: ${({ $last }) => ($last ? '24px' : '0')};
  justify-content: space-between;
  ${({ $hasBorder, theme }) =>
    $hasBorder && `border: 1px solid ${theme.palette.border.table.row};`}
  background-color: ${({ theme }) => theme.palette.background.input};
`;

const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  padding: ${({ padding }) =>
    padding ? `${padding}px` : '16px 26px 16px 16px'};
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  flex: ${({ width }) => (!width ? '1 0 0' : 'unset')};
  align-self: stretch;
  ${utils}
`;

export const AccordionContent: FC<AccordionContentProps> = props => {
  const { headers, id, items } = props;

  return (
    <>
      <AccordionContainer {...props} $last={false}>
        {headers.map((header, index) => (
          <FlexContainer
            key={`${id}-${header}`}
            width={items[index]?.width}
            padding={items[index]?.padding}
            pl={items[index]?.paddingLeft}
          >
            <Typography variant="p" color="muted">
              {header}
            </Typography>
          </FlexContainer>
        ))}
      </AccordionContainer>

      <AccordionContainer {...props} $hasBorder>
        {items.map(item => item.component)}
      </AccordionContainer>
    </>
  );
};

AccordionContent.defaultProps = {
  $hasBorder: false,
};
