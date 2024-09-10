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
    overlay={
      <div
        style={{
          maxWidth: '384px',
          wordBreak: 'break-word',
          lineBreak: 'loose',
        }}
      >
        {text}
      </div>
    }
    visible={text && isActive === true ? undefined : false}
  >
    <div>{children}</div>
  </RCTooltip>
);

Tooltip.defaultProps = {
  isActive: true,
  text: undefined,
  tooltipPlacement: 'top',
};
