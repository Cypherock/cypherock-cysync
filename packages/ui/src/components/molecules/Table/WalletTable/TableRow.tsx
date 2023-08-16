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

interface StatusContainerProps extends SpacingProps {
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

const StatusContainer = styled(LocalStyle)<StatusContainerProps>`
  min-width: 147px;
  max-width: 200px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 247px;
    max-width: 363px;
    padding: 16px 20px 16px 20px;
  }
  padding: 16px;
  flex-grow: 1;
  ${spacing}
`;

const AccountContainer = styled(LocalStyle)<StatusContainerProps>`
  min-width: 300px;
  max-width: 400px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 400px;
    max-width: 450px;
    padding-left: ${({ pleft }) => (pleft ? `${pleft}px` : '40px')};
    padding-right: ${({ pright }) => (pright ? `${pright}px` : '0')};
  }
  flex-grow: 1;
  padding-left: ${({ pleft }) => (pleft ? `${pleft}px` : '24px')};
  padding-right: ${({ pright }) => (pright ? `${pright}px` : '16px')};
`;

const BalanceContainer = styled(LocalStyle)<StatusContainerProps>`
  min-width: 141px;
  max-width: 205px;
  justify-content: flex-start;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 215px;
    max-width: 363px;
    padding: 16px 0px 16px 40px;
  }
  padding: 16px;
  flex-grow: 1;
`;

const ValueContainer = styled(BalanceContainer)`
  justify-content: flex-start;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 235px;
    max-width: 250px;
    padding: 16px 20px 16px 40px;
  }
  padding: 16px 24px 16px 16px;
`;

const ArrowContainer = styled.div<TableRowProps>`
  padding-left: ${({ arrow }) => (arrow ? '0px' : '16px')};
`;

const FullWidthTypography = styled(Typography)<TableRowProps>`
  font-size: ${({ $subMenu }) => ($subMenu ? '14px' : '16px')};
  width: ${({ $subMenu }) => ($subMenu ? '99px' : 'auto')};
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
  max-width: 100%;
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
        <AccountContainer
          pleft={$subMenu ? 66 : undefined}
          pright={$subMenu ? 16 : undefined}
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
        </AccountContainer>

        <StatusContainer>{statusImage}</StatusContainer>

        <BalanceContainer>
          <FullWidthTypography
            color="muted"
            $subMenu={$subMenu}
            $balance={$balance}
          >
            {tokenAmount}
          </FullWidthTypography>
        </BalanceContainer>

        <ValueContainer>
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
