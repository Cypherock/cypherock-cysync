import RCTooltip from 'rc-tooltip';
import React from 'react';

export { TooltipStyles } from './styles';

interface TooltipProps {
  isActive?: boolean;
  text?: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  isActive,
  text,
  children,
}) => (
  <RCTooltip
    placement="top"
    overlay={<div>{text}</div>}
    visible={text && isActive === true ? undefined : false}
  >
    {children}
  </RCTooltip>
);

Tooltip.defaultProps = {
  isActive: true,
  text: undefined,
};
