import React from 'react';
import styled, { keyframes } from 'styled-components';

import { useAccordion } from '../../../../hooks/useAccordion';
import { Flex, Tag, Typography } from '../../../atoms';
import { SpacingProps, spacing } from '../../../utils';
import { Accordion } from '../../Accordion';

interface TableRowProps {
  arrow?: React.ReactNode;
  leftImage?: React.ReactNode;
  text?: string;
  subText?: string;
  tag?: string;
  statusImage?: React.ReactNode;
  tokenAmount?: string;
  tokenValue?: string;
  tokens?: any[];
  $subMenu?: boolean;
  $balance?: boolean;
}

interface RowContainerProps {
  $rowIndex: number;
  $show?: string;
  $hide?: string;
}

const RowContainer = styled.div<RowContainerProps & TableRowProps>`
  display: flex;
  flex-direction: row;
  width: inherit;
  background: ${({ theme, $rowIndex }) =>
    $rowIndex % 2 !== 0
      ? theme.palette.border.table.row
      : theme.palette.background.content};
  max-height: ${({ $subMenu }) => ($subMenu ? '0' : 'auto')};
  overflow: hidden;
  transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
`;

interface ElementContainerProps extends SpacingProps {
  width?: number;
  pleft?: number;
  pright?: number;
}

const LocalStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 20px;
`;

const ElementContainer = styled(LocalStyle)<ElementContainerProps>`
  min-width: 215px;
  max-width: 215px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 255px;
    max-width: 363px;
  }
  flex-grow: 1;
  ${spacing}
`;

const ColumnContainer = styled(LocalStyle)<ElementContainerProps>`
  min-width: 350px;
  max-width: 400px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 400px;
    max-width: 450px;
  }
  flex-grow: 1;
  padding-left: ${({ pleft }) => (pleft ? `${pleft}px` : '40px')};
  padding-right: ${({ pright }) => (pright ? `${pright}px` : '0')};
`;

const AmountContainer = styled(LocalStyle)<ElementContainerProps>`
  min-width: 200px;
  max-width: 235px;
  justify-content: flex-start;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 215px;
    max-width: 363px;
  }
  flex-grow: 1;
  padding-left: ${({ pleft }) => (pleft ? `${pleft}px` : '40px')};
  padding-right: ${({ pright }) => (pright ? `${pright}px` : '20px')};
`;

const ValueContainer = styled(AmountContainer)`
  justify-content: flex-start;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 235px;
    max-width: 250px;
  }
`;

const ArrowContainer = styled.div<TableRowProps>`
  padding-left: ${({ arrow }) => (arrow ? '0px' : '16px')};
`;

const FullWidthTypography = styled(Typography)<TableRowProps>`
  font-size: ${({ $subMenu }) => ($subMenu ? '14px' : '16px')};
  width: ${({ $subMenu }) => ($subMenu ? '135px' : 'auto')};
  @media ${({ theme }) => theme.screens.lg} {
    width: ${({ $subMenu }) => ($subMenu ? '221px' : 'auto')};
  }
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media ${({ theme }) => theme.screens.lg} {
  }
`;

const ImageWrapper = styled.div<TableRowProps>`
  width: ${({ $subMenu }) => ($subMenu ? '24px' : '32px')};
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FadeInContainer = styled.div`
  animation: ${fadeIn} 0.5s linear;
`;

export const Accordions = styled.div`
  display: flex;
  padding: 8px 0px 16px 0px;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.row};
  background: ${({ theme }) => theme.palette.background.content};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

const SubMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 269px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const RowStyle = styled.div``;

export const TableRow: React.FC<TableRowProps & RowContainerProps> = ({
  arrow,
  leftImage,
  text,
  subText,
  tag,
  statusImage,
  tokenAmount,
  tokenValue,
  tokens,
  $subMenu,
  $rowIndex,
  $hide,
  $show,
  $balance,
}) => {
  const { isOpen, toggleAccordion } = useAccordion();
  return (
    <RowStyle>
      <RowContainer $rowIndex={$rowIndex}>
        <ColumnContainer
          pleft={$subMenu ? 66 : undefined}
          pright={$subMenu ? 20 : undefined}
        >
          <Flex gap={24} width="full">
            {$subMenu && <ArrowContainer arrow={arrow}>{arrow}</ArrowContainer>}
            {leftImage && (
              <ImageWrapper $subMenu={$subMenu}>{leftImage}</ImageWrapper>
            )}
            <Flex direction="column" gap={6}>
              <FullWidthTypography
                color={$subMenu ? 'muted' : 'white'}
                $subMenu={$subMenu}
              >
                {text}
              </FullWidthTypography>
              <Flex gap={8}>
                <Typography $fontSize={12} $fontWeight="medium" color="muted">
                  {subText}
                </Typography>
                {tag && (
                  <Tag $fontSize={10} $fontWeight="medium">
                    {tag}
                  </Tag>
                )}
              </Flex>
            </Flex>
          </Flex>
        </ColumnContainer>

        <ElementContainer pleft={20} pright={20} py={2}>
          {statusImage}
        </ElementContainer>

        <AmountContainer pl={5} py={2}>
          <FullWidthTypography
            color="muted"
            $subMenu={$subMenu}
            $balance={$balance}
          >
            {tokenAmount}
          </FullWidthTypography>
        </AmountContainer>

        <ValueContainer pl={5} pright={20} py={2}>
          <Typography color="muted">{tokenValue}</Typography>
        </ValueContainer>
      </RowContainer>
      {tokens && tokens.length > 0 && isOpen && (
        <SubMenuWrapper>
          {tokens.map((token, index) => (
            <FadeInContainer key={`fade-in-${index + 1}`}>
              <TableRow
                key={`tokens-${index + 1}`}
                arrow={token.arrow}
                leftImage={token.leftImage}
                text={token.text}
                tokenAmount={token.tokenAmount}
                tokenValue={token.tokenValue}
                $rowIndex={$rowIndex}
                $subMenu
              />
            </FadeInContainer>
          ))}
        </SubMenuWrapper>
      )}
      {tokens && tokens.length > 0 && (
        <Accordion
          tokensLength={tokens.length}
          isOpen={isOpen}
          toggleAccordion={toggleAccordion}
          $show={$show}
          $hide={$hide}
        />
      )}
    </RowStyle>
  );
};

TableRow.defaultProps = {
  arrow: undefined,
  leftImage: undefined,
  text: '',
  subText: '',
  tag: '',
  statusImage: undefined,
  tokenAmount: '',
  tokenValue: '',
  tokens: [],
  $subMenu: false,
  $show: '',
  $balance: false,
  $hide: '',
};
