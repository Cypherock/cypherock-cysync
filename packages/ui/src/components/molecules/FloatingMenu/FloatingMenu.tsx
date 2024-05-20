import {
  FloatingFocusManager,
  Placement,
  autoUpdate,
  flip,
  shift,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  OffsetOptions,
  FloatingOverlay,
} from '@floating-ui/react';
import React, { useState } from 'react';

import { DropdownMenu, DropdownMenuProps } from './DropdownMenu';

export interface FloatingMenuProps
  extends Omit<DropdownMenuProps, 'isOpen' | 'setIsOpen'> {
  children: React.ReactNode | React.ReactNode[];
  disabled?: boolean;
  placement?: Placement;
  offset?: OffsetOptions;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  children,
  placement,
  offset: offsetOptions,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      flip({ fallbackAxisSideDirection: 'end' }),
      shift(),
      offset(offsetOptions ?? 0),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>
      {isOpen && !props.disabled && (
        <>
          <FloatingOverlay style={{ zIndex: 10 }} />
          <FloatingFocusManager context={context} modal={false}>
            <span
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 20, width: 'inherit' }}
              {...getFloatingProps()}
            >
              <DropdownMenu {...props} isOpen={isOpen} setIsOpen={setIsOpen} />
            </span>
          </FloatingFocusManager>
        </>
      )}
    </>
  );
};

FloatingMenu.defaultProps = {
  disabled: false,
  placement: undefined,
  offset: undefined,
};
