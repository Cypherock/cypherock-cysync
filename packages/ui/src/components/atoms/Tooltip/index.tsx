import RCTooltip from 'rc-tooltip';
import React from 'react';

export { TooltipStyles } from './styles';

export interface TooltipProps {
  isActive?: boolean;
  text?: string;
  tooltipPlacement?: TooltipPlacement;
  children: React.ReactElement;
}

export type TooltipPlacement = 'top' | 'bottom';

export const Tooltip: React.FC<TooltipProps> = ({
  isActive,
  text,
  tooltipPlacement,
  children,
}) => (
  <RCTooltip
    placement={tooltipPlacement}
    overlay={<div>{text}</div>}
    visible={text && isActive === true ? undefined : false}
  >
    {children}
  </RCTooltip>
);

Tooltip.defaultProps = {
  isActive: true,
  text: undefined,
  tooltipPlacement: 'top',
};
