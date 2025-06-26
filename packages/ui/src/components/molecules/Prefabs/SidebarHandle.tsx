import React, { forwardRef } from 'react';

import { Flex } from '../../atoms';

type SidebarHandleProps = React.ComponentProps<typeof Flex> &
  Pick<React.HTMLAttributes<HTMLSpanElement>, 'onMouseDown'>;

export const SidebarHandle = forwardRef<HTMLSpanElement, SidebarHandleProps>(
  ({ onMouseDown, ...props }, ref) => (
    <Flex
      $borderColor="topbar"
      $borderWidthX={1}
      align="center"
      justify="center"
      width="7px"
      {...props}
    >
      {/* eslint-disable jsx-a11y/no-static-element-interactions  */}
      <span
        onMouseDown={onMouseDown}
        ref={ref}
        style={{
          padding: 2.5,
          cursor: 'ew-resize',
        }}
      >
        <span
          style={{
            width: '1px',
            height: '24px',
            borderRadius: '2px',
            background: '#cbc4b9',
            padding: 1,
          }}
          aria-label="Sidebar drag handle"
          aria-disabled="true"
        />
      </span>
    </Flex>
  ),
);
SidebarHandle.displayName = 'SidebarHandle';
