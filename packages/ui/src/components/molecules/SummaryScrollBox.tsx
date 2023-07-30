import React from 'react';
import { styled } from 'styled-components';
import {
  Typography,
  Image,
  ImageContainer,
  Divider,
  Main,
  LeftContainer,
  RightContainer,
  NestedContainer,
} from '../..';

const ParentContainer = styled.div`
  align-self: stretch;
  overflow-y: auto;
  max-height: 226px;
  border-radius: 8px;
  border: 1px solid #2d281f;
  background: #1b1812;
  padding-left: 16px;
  padding-right: 16px;
`;

export type SummaryScrollBoxProps = {
  fromText: string;
  walletIconSrc: string;
  cypherockRedText: string;
  ethereumIconSrc: string;
  ethereumText: string;
  qrCodeIconSrc: string;
  toAddress: string;
  amountEth: string;
  amountInDollar: string;
  networkFeeEth: string;
  networkFeeInDollar: string;
  totalDebitEth: string;
  totalDebitInDollar: string;
};

export const SummaryScrollBox: React.FC<SummaryScrollBoxProps> = ({
  fromText,
  walletIconSrc,
  cypherockRedText,
  ethereumIconSrc,
  ethereumText,
  qrCodeIconSrc,
  toAddress,
  amountEth,
  amountInDollar,
  networkFeeEth,
  networkFeeInDollar,
  totalDebitEth,
  totalDebitInDollar,
}) => (
  <>
    <Main>
      <LeftContainer>
        <ImageContainer gap={8}>
          <Image
            src={walletIconSrc}
            alt="Left Image"
            width="15px"
            height="12px"
          />
          <Typography variant="p" color="muted" $fontSize={14}>
            {fromText}
          </Typography>
        </ImageContainer>
      </LeftContainer>
      <RightContainer>
        <Typography variant="p" $fontSize={14} color="muted">
          {cypherockRedText}
        </Typography>
        <Typography variant="p" $fontSize={14} color="muted">
          /
        </Typography>
        <ImageContainer gap={8}>
          <Image
            src={ethereumIconSrc}
            alt="Left Image"
            width="11px"
            height="16px"
          />
          <Typography variant="p" $fontSize={14}>
            {ethereumText}
          </Typography>
        </ImageContainer>
      </RightContainer>
    </Main>
    <ParentContainer>
      <Main top={16}>
        <LeftContainer>
          <ImageContainer gap={8}>
            <Image
              src={qrCodeIconSrc}
              alt="Left Image"
              width="11px"
              height="20px"
            />
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

      <Main top={24}>
        <LeftContainer>
          <Typography variant="p" color="muted" $fontSize={14}>
            Amount
          </Typography>
        </LeftContainer>
        <RightContainer>
          <NestedContainer>
            <Typography variant="p" $fontSize={14}>
              {amountEth}
            </Typography>
            <Typography variant="p" $fontSize={14} color="muted">
              {amountInDollar}
            </Typography>
          </NestedContainer>
        </RightContainer>
      </Main>

      <Divider variant="horizontal" />

      <Main top={24}>
        <LeftContainer>
          <ImageContainer gap={8}>
            <Image
              src={qrCodeIconSrc}
              alt="Left Image"
              width="11px"
              height="20px"
            />
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

      <Main top={24}>
        <LeftContainer>
          <Typography variant="p" color="muted" $fontSize={14}>
            Amount
          </Typography>
        </LeftContainer>
        <RightContainer>
          <NestedContainer>
            <Typography variant="p" $fontSize={14}>
              {amountEth}
            </Typography>
            <Typography variant="p" $fontSize={14} color="muted">
              {amountInDollar}
            </Typography>
          </NestedContainer>
        </RightContainer>
      </Main>
    </ParentContainer>

    <Main>
      <LeftContainer>
        <Typography variant="p" $fontSize={14} color="muted">
          Network Fee
        </Typography>
      </LeftContainer>
      <RightContainer>
        <NestedContainer>
          <Typography variant="p" $fontSize={14}>
            {networkFeeEth}
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            {networkFeeInDollar}
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
            {totalDebitEth}
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            {totalDebitInDollar}
          </Typography>
        </NestedContainer>
      </RightContainer>
    </Main>
  </>
);
