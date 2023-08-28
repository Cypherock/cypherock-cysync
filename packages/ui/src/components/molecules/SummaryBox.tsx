import React, { ReactNode } from 'react';

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
  OptimismIcon,
} from '../..';

interface FromItem {
  id: number;
  name: string;
  muted: boolean;
}

interface SummaryRowProps {
  leftText?: string;
  leftIcon?: ReactNode;
  rightText?: string;
  rightComponent?: FromItem[];
  rightSubText?: string;
  margin?: number;
  index?: string;
}

const imageSrcMap: any = {
  'Ethereum 1': (
    <Image src={etheriumBlueIcon} alt="From" width="15px" height="12px" />
  ),
  Optimism: <OptimismIcon height={16} width={15} />,
};

export const SummaryRow: React.FC<SummaryRowProps> = ({
  leftText,
  leftIcon,
  rightText,
  rightSubText,
  rightComponent,
  margin,
  index,
}) => (
  <SummaryContainer
    key={`container-${index}`}
    leftComponent={
      <ImageContainer gap={8}>
        {leftIcon && leftIcon}
        <Typography variant="p" $fontSize={14} color="muted">
          {leftText}
        </Typography>
      </ImageContainer>
    }
    rightComponent={
      rightComponent ? (
        <>
          {rightComponent.map((from, idx) => {
            const { id, name, muted } = from;
            const imageSrc = imageSrcMap[name];

            return (
              <Container key={id} display="flex" direction="row" gap={12}>
                <ImageContainer gap={8}>
                  {imageSrc && imageSrc}
                  <Typography
                    variant="p"
                    color={muted ? 'muted' : undefined}
                    $fontSize={14}
                  >
                    {name}
                  </Typography>
                </ImageContainer>
                {idx !== rightComponent.length - 1 && (
                  <Typography variant="p" color="muted" $fontSize={14}>
                    /
                  </Typography>
                )}
              </Container>
            );
          })}
        </>
      ) : (
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
      )
    }
    margin={margin}
  />
);

SummaryRow.defaultProps = {
  leftText: undefined,
  rightText: undefined,
  rightComponent: undefined,
  margin: undefined,
  leftIcon: undefined,
  rightSubText: undefined,
  index: undefined,
};

type SummaryItemType =
  | (SummaryRowProps & { id: string })
  | { isDivider: boolean; id: string }
  | (SummaryRowProps[] & { id?: string });

export interface SummaryBoxProps {
  items: SummaryItemType[];
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({ items }) => (
  <>
    {items.map(item => {
      if ('isDivider' in item && item.isDivider) {
        return <Divider variant="horizontal" key={`divider-${item.id}`} />;
      }

      if (Array.isArray(item)) {
        const SummaryItems = item.map(to => {
          if ('isDivider' in to && to.isDivider) {
            return (
              <Divider
                variant="horizontal"
                key={`divider-nested-${to.index}`}
              />
            );
          }
          return <SummaryRow key={`summary-nested-${to.index}`} {...to} />;
        });

        if (item.length > 2) {
          return (
            <ScrollContainer key={`scroll-${item.id}`}>
              {SummaryItems}
            </ScrollContainer>
          );
        }

        return SummaryItems;
      }

      return (
        <SummaryRow
          key={`summary-${item.id}`}
          index={`${item.id}`}
          {...(item as SummaryRowProps)}
        />
      );
    })}
  </>
);
