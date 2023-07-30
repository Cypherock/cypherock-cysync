import React from 'react';
import { css, styled } from 'styled-components';
import { Typography, Image, ImageContainer, Divider } from '../..';

export interface SummaryBoxProps {
  fromIcon: string;
  toIcon: string;
  etheriumIcon: string;
  fromText: string;
  walletName: string;
  ethereumAmount: string;
  toAddress: string;
  amountEth: string;
  amountUsd: string;
  networkFeeEth: string;
  networkFeeUsd: string;
  totalEth: string;
  totalUsd: string;
}

export const commonContainerStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Main = styled.div<{ top?: number }>`
  display: flex;
  justify-content: center;
  align-self: stretch;
  align-items: flex-start;
  margin: ${props => (props.top ? `${props.top}px 0` : '0')};
`;

export const LeftContainer = styled.div`
  ${commonContainerStyles};
`;

export const RightContainer = styled.div`
  margin-left: auto;
  ${commonContainerStyles};
`;

export const NestedContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

export const SummaryBox: React.FC<SummaryBoxProps> = ({
  fromIcon,
  toIcon,
  etheriumIcon,
  fromText,
  walletName,
  ethereumAmount,
  toAddress,
  amountEth,
  amountUsd,
  networkFeeEth,
  networkFeeUsd,
  totalEth,
  totalUsd,
}) => (
  <>
    <Main>
      <LeftContainer>
        <ImageContainer gap={8}>
          <Image src={fromIcon} alt="From Icon" width="15px" height="12px" />
          <Typography variant="p" color="muted" $fontSize={14}>
            {fromText}
          </Typography>
        </ImageContainer>
      </LeftContainer>
      <RightContainer>
        <Typography variant="p" $fontSize={14} color="muted">
          {walletName}
        </Typography>
        <Typography variant="p" $fontSize={14} color="muted">
          /
        </Typography>
        <ImageContainer gap={8}>
          <Image
            src={etheriumIcon}
            alt="Etherium Icon"
            width="11px"
            height="16px"
          />
          <Typography variant="p" $fontSize={14}>
            {ethereumAmount}
          </Typography>
        </ImageContainer>
      </RightContainer>
    </Main>

    <Divider variant="horizontal" />

    <Main>
      <LeftContainer>
        <ImageContainer gap={8}>
          <Image src={toIcon} alt="To Icon" width="11px" height="16px" />
          <Typography variant="p" color="muted" $fontSize={14}>
            To
          </Typography>
        </ImageContainer>
      </LeftContainer>
      <RightContainer>
        <Typography variant="p" $fontSize={14}>
          {toAddress}
        </Typography>
      </RightContainer>
    </Main>

    <Main>
      <LeftContainer>
        <Typography variant="p" color="muted" $fontSize={14}>
          Amount
        </Typography>
      </LeftContainer>
      <RightContainer>
        <NestedContainer>
          <Typography variant="p" $fontSize={14}>
            {amountEth} ETH
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            ${amountUsd}
          </Typography>
        </NestedContainer>
      </RightContainer>
    </Main>

    <Divider variant="horizontal" />

    <Main>
      <LeftContainer>
        <Typography variant="p" $fontSize={14} color="muted">
          Network Fee
        </Typography>
      </LeftContainer>
      <RightContainer>
        <NestedContainer>
          <Typography variant="p" $fontSize={14}>
            {networkFeeEth} ETH
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            ${networkFeeUsd}
          </Typography>
        </NestedContainer>
      </RightContainer>
    </Main>

    <Divider variant="horizontal" />

    <Main>
      <LeftContainer>
        <Typography variant="p" color="muted" $fontSize={14}>
          Total to debit
        </Typography>
      </LeftContainer>
      <RightContainer>
        <NestedContainer>
          <Typography variant="p" $fontSize={14}>
            {totalEth} ETH
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            ${totalUsd}
          </Typography>
        </NestedContainer>
      </RightContainer>
    </Main>
  </>
);
