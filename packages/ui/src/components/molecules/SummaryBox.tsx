import React from 'react';
import {
  Typography,
  Image,
  ImageContainer,
  Divider,
  SummaryContainer,
  NestedContainer,
  ScrollContainer,
} from '../..';

interface ToItem {
  id: number;
  address: string;
  amountEth: string;
  amountUsd: string;
}

interface ToDetailItemProps {
  toIcon: string;
  margin?: number;
  to: ToItem;
  toText: string;
  amountText: string;
  isLast: boolean;
}

export type SummaryScrollBoxProps = {
  fromText: string;
  fromIcon: string;
  toText: string;
  amountText: string;
  networkText: string;
  debitText: string;
  walletName: string;
  ethereumIcon: string;
  ethereumText: string;
  toIcon: string;
  toDetails: ToItem[];
  networkFeeEth: string;
  networkFeeUsd: string;
  totalDebitEth: string;
  totalDebitUsd: string;
};

export const ToDetailItem: React.FC<ToDetailItemProps> = ({
  margin,
  toIcon,
  to,
  toText,
  amountText,
  isLast,
}) => (
  <>
    <SummaryContainer
      leftComponent={
        <ImageContainer gap={8}>
          <Image src={toIcon} alt="To" width="11px" height="20px" />
          <Typography variant="p" color="muted" $fontSize={14}>
            {toText}
          </Typography>
        </ImageContainer>
      }
      rightComponent={
        <Typography variant="p" $fontSize={14}>
          {to.address}
        </Typography>
      }
      margin={margin}
    />

    <SummaryContainer
      leftComponent={
        <Typography variant="p" color="muted" $fontSize={14}>
          {amountText}
        </Typography>
      }
      rightComponent={
        <NestedContainer>
          <Typography variant="p" $fontSize={14}>
            {to.amountEth}
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            {to.amountUsd}
          </Typography>
        </NestedContainer>
      }
      margin={margin}
    />

    {!isLast && <Divider variant="horizontal" />}
  </>
);

ToDetailItem.defaultProps = {
  margin: undefined,
};

export const SummaryBox: React.FC<SummaryScrollBoxProps> = ({
  fromText,
  toText,
  amountText,
  networkText,
  debitText,
  fromIcon,
  walletName,
  ethereumIcon,
  ethereumText,
  toIcon,
  toDetails,
  networkFeeEth,
  networkFeeUsd,
  totalDebitEth,
  totalDebitUsd,
}) => (
  <>
    <SummaryContainer
      leftComponent={
        <ImageContainer gap={8}>
          <Image src={fromIcon} alt="From" width="15px" height="12px" />
          <Typography variant="p" color="muted" $fontSize={14}>
            {fromText}
          </Typography>
        </ImageContainer>
      }
      rightComponent={
        <>
          <Typography variant="p" $fontSize={14} color="muted">
            {walletName}
          </Typography>
          <ImageContainer gap={8}>
            <Image src={ethereumIcon} alt="eth" width="11px" height="16px" />
            <Typography variant="p" $fontSize={14}>
              {ethereumText}
            </Typography>
          </ImageContainer>
        </>
      }
    />

    {toDetails.length === 1 && <Divider variant="horizontal" />}

    {toDetails.length > 1 ? (
      <ScrollContainer>
        {toDetails.map((to, index) => (
          <ToDetailItem
            key={to.id}
            toIcon={toIcon}
            to={to}
            toText={toText}
            amountText={amountText}
            margin={24}
            isLast={index === toDetails.length - 1}
          />
        ))}
      </ScrollContainer>
    ) : (
      <>
        {toDetails.map((to, index) => (
          <ToDetailItem
            key={to.id}
            toIcon={toIcon}
            to={to}
            toText={toText}
            amountText={amountText}
            isLast={index === toDetails.length - 1}
          />
        ))}
      </>
    )}

    {toDetails.length === 1 && <Divider variant="horizontal" />}

    <SummaryContainer
      leftComponent={
        <Typography variant="p" $fontSize={14} color="muted">
          {networkText}
        </Typography>
      }
      rightComponent={
        <NestedContainer>
          <Typography variant="p" $fontSize={14}>
            {networkFeeEth}
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            {networkFeeUsd}
          </Typography>
        </NestedContainer>
      }
    />

    <Divider variant="horizontal" />

    <SummaryContainer
      leftComponent={
        <Typography variant="p" color="muted" $fontSize={14}>
          {debitText}
        </Typography>
      }
      rightComponent={
        <NestedContainer>
          <Typography variant="p" $fontSize={14}>
            {totalDebitEth}
          </Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            {totalDebitUsd}
          </Typography>
        </NestedContainer>
      }
    />
  </>
);
