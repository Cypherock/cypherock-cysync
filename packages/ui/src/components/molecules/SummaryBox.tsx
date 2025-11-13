import React, { ReactNode } from 'react';

import {
  Typography,
  ImageContainer,
  Divider,
  SummaryContainer,
  NestedContainer,
  ScrollContainer,
  Container,
  TypographyColor,
} from '../..';

interface FromItem {
  id: string;
  name: string;
  muted: boolean;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

interface SummaryRowProps {
  leftText?: string;
  leftIcon?: ReactNode;
  rightText?: string;
  rightTextColor?: TypographyColor;
  bottomText?: string;
  rightComponent?: FromItem[];
  rightSubText?: string;
  margin?: number;
  id?: string;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({
  leftText,
  leftIcon,
  rightText,
  rightTextColor,
  bottomText,
  rightSubText,
  rightComponent,
  margin,
  id,
}) => (
  <SummaryContainer
    key={`container-${id}`}
    leftComponent={
      <ImageContainer gap={8}>
        {leftIcon && leftIcon}
        <Typography
          variant="p"
          $fontSize={14}
          color="muted"
          mr={3}
          $whiteSpace="nowrap"
        >
          {leftText}
        </Typography>
      </ImageContainer>
    }
    bottomComponent={
      bottomText && (
        <Typography variant="p" $fontSize={14} pt="-10px">
          {bottomText}
        </Typography>
      )
    }
    rightComponent={
      rightComponent ? (
        <>
          {rightComponent.map((from, idx) => {
            const { id: _id, name, muted, icon, rightIcon } = from;

            return (
              <Container key={_id} gap={12}>
                <ImageContainer gap={8} style={{ alignItems: 'flex-center' }}>
                  {icon}
                  <Typography
                    variant="p"
                    color={muted ? 'muted' : undefined}
                    $fontSize={14}
                    $textAlign="right"
                    $maxWidth={300}
                  >
                    {name}
                  </Typography>
                  {rightIcon}
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
          <Typography
            variant="p"
            $fontSize={14}
            $textAlign="right"
            color={rightTextColor ?? 'normal'}
            $maxWidth={300}
            $whiteSpace="pre-wrap"
            $wordBreak="break-all"
          >
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
  rightTextColor: undefined,
  bottomText: undefined,
  rightComponent: undefined,
  margin: undefined,
  leftIcon: undefined,
  rightSubText: undefined,
  id: undefined,
};

export type SummaryItemType =
  | (SummaryRowProps & { id: string })
  | { isDivider: boolean; id: string }
  | ((SummaryRowProps & { id: string }) | { isDivider: boolean; id: string })[];

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
              <Divider variant="horizontal" key={`divider-nested-${to.id}`} />
            );
          }
          return (
            <SummaryRow key={`summary-nested-${to.id}`} {...to} margin={24} />
          );
        });

        return (
          <ScrollContainer key={`scroll-${item.map(i => i.id).join('-')}`}>
            {SummaryItems}
          </ScrollContainer>
        );
      }

      return (
        <SummaryRow
          key={`summary-${item.id}`}
          id={`${item.id}`}
          {...(item as SummaryRowProps)}
        />
      );
    })}
  </>
);
