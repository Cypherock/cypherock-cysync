import React from 'react';
import {
  Typography,
  Image,
  ImageContainer,
  Divider,
  SummaryContainer,
  NestedContainer,
  ScrollContainer,
  etheriumBlueIcon,
  Container,
} from '../..';
import SvgOptimism from '../../assets/icons/generated/Optimism';

interface CustomSummaryContainerProps {
  leftText: string;
  leftIcon?: string;
  rightText: string;
  rightSubText?: string;
  margin?: number;
}

export const SummaryRow: React.FC<CustomSummaryContainerProps> = ({
  leftText,
  leftIcon,
  rightText,
  rightSubText,
  margin,
}) => (
  <SummaryContainer
    leftComponent={
      <ImageContainer gap={8}>
        {leftIcon && (
          <Image src={leftIcon} alt="To" width="11px" height="20px" />
        )}
        <Typography variant="p" $fontSize={14} color="muted">
          {leftText}
        </Typography>
      </ImageContainer>
    }
    rightComponent={
      <NestedContainer>
        <Typography variant="p" $fontSize={14}>
          {rightText}
        </Typography>
        {rightSubText && (
          <Typography variant="p" $fontSize={14} color="muted">
            {rightSubText}
          </Typography>
        )}
      </NestedContainer>
    }
    margin={margin}
  />
);

SummaryRow.defaultProps = {
  margin: undefined,
  leftIcon: undefined,
  rightSubText: undefined,
};

interface FromItem {
  id: number;
  name: string;
  muted: boolean;
}

interface ToItem {
  id: number;
  address: string;
  amountEth: string;
  amountUsd: string;
}

export type SummaryScrollBoxProps = {
  fromText: string;
  fromIcon: string;
  toText: string;
  amountText: string;
  networkText: string;
  debitText: string;
  toIcon: string;
  fromDetails: FromItem[];
  toDetails: ToItem[];
  networkFeeEth: string;
  networkFeeUsd: string;
  totalDebitEth: string;
  totalDebitUsd: string;
};

const imageSrcMap: any = {
  'Ethereum 1': etheriumBlueIcon,
  Optimism: <SvgOptimism height={16} width={15} />,
};

export const SummaryBox: React.FC<SummaryScrollBoxProps> = ({
  fromText,
  toText,
  amountText,
  networkText,
  debitText,
  fromIcon,
  toIcon,
  fromDetails,
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
          {fromDetails.map((item, index) => {
            const { id, name, muted } = item;
            const imageSrc = imageSrcMap[name];
            let imageContent;
            if (imageSrc && typeof imageSrc === 'string') {
              imageContent = (
                <Image src={imageSrc} alt="From" width="15px" height="12px" />
              );
            } else if (imageSrc && typeof imageSrc !== 'string') {
              imageContent = imageSrc;
            }

            return (
              <Container key={id} display="flex" direction="row" gap={12}>
                <ImageContainer gap={8}>
                  {imageSrc && imageContent}
                  <Typography
                    variant="p"
                    color={muted ? 'muted' : undefined}
                    $fontSize={14}
                  >
                    {name}
                  </Typography>
                </ImageContainer>
                {!(index === fromDetails.length - 1) && (
                  <Typography variant="p" color="muted" $fontSize={14}>
                    /
                  </Typography>
                )}
              </Container>
            );
          })}
        </>
      }
    />

    {toDetails.length === 1 && <Divider variant="horizontal" />}

    {toDetails.length > 1 ? (
      <ScrollContainer>
        {toDetails.map((to, index) => (
          <>
            <SummaryRow
              leftIcon={toIcon}
              leftText={toText}
              rightText={to.address}
              margin={24}
            />
            <SummaryRow
              leftText={amountText}
              rightText={to.amountEth}
              rightSubText={to.amountUsd}
              margin={24}
            />
            {!(index === toDetails.length - 1) && (
              <Divider variant="horizontal" />
            )}
          </>
        ))}
      </ScrollContainer>
    ) : (
      <>
        {toDetails.map((to, index) => (
          <>
            <SummaryRow
              leftIcon={toIcon}
              leftText={toText}
              rightText={to.address}
            />
            <SummaryRow
              leftText={amountText}
              rightText={to.amountEth}
              rightSubText={to.amountUsd}
            />
            {!(index === toDetails.length - 1) && (
              <Divider variant="horizontal" />
            )}
          </>
        ))}
      </>
    )}

    {toDetails.length === 1 && <Divider variant="horizontal" />}

    <SummaryRow
      leftText={networkText}
      rightText={networkFeeEth}
      rightSubText={networkFeeUsd}
    />

    <Divider variant="horizontal" />

    <SummaryRow
      leftText={debitText}
      rightText={totalDebitEth}
      rightSubText={totalDebitUsd}
    />
  </>
);
