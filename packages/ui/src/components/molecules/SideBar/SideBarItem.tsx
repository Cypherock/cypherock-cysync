import React, { FC, ReactNode } from 'react';
import { useTheme, styled } from 'styled-components';

import { CaretIcon, SvgProps } from '../../../assets';
import { Flex, Typography, TypographyColor } from '../../atoms';
import { svgGradients } from '../../GlobalStyles';

export enum SideBarState {
  disabled,
  normal,
  active,
  selected,
  error,
}

const ClickableFlex = styled(Flex)<
  React.HTMLAttributes<HTMLDivElement> & { disabled: boolean }
>`
  cursor: pointer;

  ${props =>
    props.disabled
      ? `
      pointer-events: none;
      cursor: auto;
  `
      : `
      &:hover {
        filter: brightness(150%);
      }
    `}
`;

export interface SideBarItemProps {
  Icon?: FC<SvgProps>;
  svgStroke?: boolean;
  text: string;
  state?: SideBarState;
  child?: 'regular' | 'last';
  isCollapsed?: boolean;
  extraLeft?: ReactNode;
  extraRight?: ReactNode;
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideBarItem: FC<SideBarItemProps> = ({
  Icon,
  svgStroke,
  text,
  state,
  child,
  isCollapsed,
  extraLeft,
  extraRight,
  children,
  setIsCollapsed,
  onClick,
}) => {
  const theme = useTheme()!;

  const int = (x: string) => parseInt(x, 10);

  const textColorMap: Record<SideBarState, TypographyColor> = {
    [SideBarState.disabled]: 'disabled',
    [SideBarState.normal]: 'muted',
    [SideBarState.active]: 'heading',
    [SideBarState.selected]: 'gold',
    [SideBarState.error]: 'errorDark',
  };
  const textColor: TypographyColor = textColorMap[state!];

  const svgColor: string = {
    [SideBarState.disabled]: theme.palette.text.disabled,
    [SideBarState.normal]: theme.palette.text.normal,
    [SideBarState.active]: theme.palette.text.heading,
    [SideBarState.selected]: `url(#${svgGradients.gold})`,
    [SideBarState.error]: theme.palette.warn.main,
  }[state!];

  const lineProps = {
    stroke: theme.palette.muted.main,
    strokeWidth: 1,
    vectorEffect: 'non-scaling-stroke',
  };

  return (
    <Flex
      direction="column"
      width="full"
      $cursor={state === SideBarState.disabled ? 'not-allowed' : undefined}
    >
      <Flex gap={int(theme.spacing.two.spacing)} width="full">
        {child && (
          <svg
            width={theme.spacing.two.spacing}
            style={{ flexShrink: 0 }}
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line x1={0} y1={0} x2={0} y2={50} {...lineProps} />
            <line x1={0} y1={50} x2={100} y2={50} {...lineProps} />
            {child === 'regular' && isCollapsed && (
              <line x1={0} y1={50} x2={0} y2={100} {...lineProps} />
            )}
          </svg>
        )}
        <ClickableFlex
          disabled={state === SideBarState.disabled}
          py={1}
          onClick={
            children && setIsCollapsed
              ? () => setIsCollapsed(!isCollapsed)
              : onClick
          }
          align="center"
          $overflowX="hidden"
          width="full"
        >
          <Flex
            gap={int(theme.spacing.two.spacing)}
            width="full"
            align="center"
            $overflowX="hidden"
          >
            {Icon && (
              <Flex align="center">
                {' '}
                <Icon
                  fill={svgStroke ? 'none' : svgColor}
                  stroke={svgStroke ? svgColor : 'none'}
                />{' '}
              </Flex>
            )}
            <Typography
              variant="h6"
              color={textColor}
              py={1}
              $fontWeight="medium"
              $whiteSpace="nowrap"
              $textOverflow="ellipsis"
              title={text}
            >
              {text}
            </Typography>
            {extraLeft}
          </Flex>
          <Flex
            justify="flex-end"
            gap={int(theme.spacing.two.spacing)}
            align="center"
          >
            {extraRight}
            {children && (
              <CaretIcon
                rotate={isCollapsed ? 90 : 0}
                fill={
                  state === SideBarState.disabled
                    ? theme.palette.text.disabled
                    : theme.palette.muted.main
                }
              />
            )}
          </Flex>
        </ClickableFlex>
      </Flex>
      {!isCollapsed && (
        <Flex pl="13" direction="column">
          {children}
        </Flex>
      )}
    </Flex>
  );
};

SideBarItem.defaultProps = {
  Icon: undefined,
  svgStroke: false,
  state: SideBarState.normal,
  child: undefined,
  isCollapsed: true,
  extraLeft: undefined,
  extraRight: undefined,
  children: undefined,
  onClick: undefined,
  setIsCollapsed: undefined,
};
