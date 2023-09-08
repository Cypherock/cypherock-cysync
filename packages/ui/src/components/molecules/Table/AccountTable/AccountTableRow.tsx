import React from 'react';
import styled, { keyframes } from 'styled-components';

import { useAccordion } from '../../../../hooks/useAccordion';
import { Flex, Tag, Typography } from '../../../atoms';
import { SpacingProps, spacing } from '../../../utils';
import { Accordion } from '../../Accordion';
import { RowWrapper, RowContainer } from '../TableStyles';

export interface AccountTableRowProps {
  arrow?: React.ReactNode;
  leftImage?: React.ReactNode;
  text?: string;
  subText?: string;
  tag?: string;
  statusImage?: React.ReactNode;
  amount?: string;
  value?: string;
  tokens?: any[];
  $subMenu?: boolean;
  onClick?: () => void;
  onStatusClick?: () => void;
  $rowIndex: number;
  $isLast?: boolean;
  $show?: string;
  $hide?: string;
}

interface StatusContainerProps extends SpacingProps {
  width?: number;
  pleft?: number;
  pright?: number;
}

const StatusContainer = styled.div<StatusContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  cursor: pointer;
  width: 19%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 26%;
    padding: 16px 20px 16px 20px;
  }
  ${spacing}
`;

const AccountContainer = styled.div<StatusContainerProps>`
  width: 42%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 29%;
    padding: var(--16-px, 16px) var(--0-px, 0px) var(--16-px, 16px) 40px;
  }
  padding: var(--16-px, 16px) var(--16-px, 16px) var(--16-px, 16px)
    var(--24-px, 24px);
`;

const BalanceContainer = styled.div<StatusContainerProps>`
  justify-content: flex-start;
  padding: 16px;

  width: 19%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 26%;
    padding: 16px 0px;
  }
`;

const ValueContainer = styled.div`
  padding: 16px 24px 16px 16px;

  width: 20%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 19%;
    padding: 16px 20px 16px 40px;
  }
`;

const ArrowContainer = styled.div<Pick<AccountTableRowProps, 'arrow'>>`
  padding-left: ${({ arrow }) => (arrow ? '0px' : '16px')};
`;

const FullWidthTypography = styled(Typography)<
  Pick<AccountTableRowProps, '$subMenu'>
>`
  font-size: ${({ $subMenu }) => ($subMenu ? '14px' : '16px')};
  width: ${({ $subMenu }) => ($subMenu ? '99px' : 'auto')};
  @media ${({ theme }) => theme.screens.mdlg} {
    width: ${({ $subMenu }) => ($subMenu ? '221px' : 'auto')};
  }
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media ${({ theme }) => theme.screens.mdlg} {
  }
`;

const ImageWrapper = styled.div<Pick<AccountTableRowProps, '$subMenu'>>`
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

export const AccountTableRow: React.FC<AccountTableRowProps> = props => {
  const {
    arrow,
    leftImage,
    text,
    subText,
    tag,
    statusImage,
    amount,
    value,
    tokens,
    $subMenu,
    $rowIndex,
    $hide,
    $show,
    $isLast,
    onClick,
    onStatusClick,
  } = props;
  const { isOpen, toggleAccordion } = useAccordion();

  return (
    <>
      <RowWrapper
        $rowIndex={$rowIndex}
        $isLast={$isLast}
        onClick={onClick}
        $height="85px"
      >
        <RowContainer>
          <AccountContainer
            pleft={$subMenu ? 66 : undefined}
            pright={$subMenu ? 16 : undefined}
          >
            <Flex gap={24} width="full" align="center">
              {$subMenu && (
                <ArrowContainer arrow={arrow}>{arrow}</ArrowContainer>
              )}
              {leftImage && (
                <ImageWrapper $subMenu={$subMenu}>{leftImage}</ImageWrapper>
              )}
              <Flex direction="column" gap={6}>
                <FullWidthTypography color={$subMenu ? 'muted' : 'white'}>
                  {text}
                </FullWidthTypography>
                <Flex gap={8} align="center">
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

          <StatusContainer
            onClick={e => {
              e.stopPropagation();
              if (onStatusClick) {
                onStatusClick();
              }
            }}
          >
            {statusImage}
          </StatusContainer>

          <BalanceContainer>
            <FullWidthTypography color="muted">{amount}</FullWidthTypography>
          </BalanceContainer>

          <ValueContainer>
            <Typography color="muted">{value}</Typography>
          </ValueContainer>
        </RowContainer>
      </RowWrapper>
      {tokens && tokens.length > 0 && isOpen && (
        <SubMenuWrapper>
          {tokens.map((token, index) => (
            <FadeInContainer key={`fade-in-${index + 1}`}>
              <AccountTableRow
                key={`tokens-${index + 1}`}
                arrow={token.arrow}
                leftImage={token.leftImage}
                text={token.text}
                amount={token.amount}
                value={token.value}
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
    </>
  );
};

AccountTableRow.defaultProps = {
  arrow: undefined,
  leftImage: undefined,
  text: '',
  subText: '',
  tag: '',
  statusImage: undefined,
  amount: '',
  value: '',
  tokens: [],
  $subMenu: false,
  $show: '',
  $hide: '',
  onClick: undefined,
  onStatusClick: undefined,
  $isLast: false,
};
