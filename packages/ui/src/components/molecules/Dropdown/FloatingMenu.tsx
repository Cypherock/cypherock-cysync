import {
  FloatingFocusManager,
  Placement,
  autoUpdate,
  flip,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import React from 'react';

import {
  DropDownMenuProps,
  DropdownMenu,
  MultiSelectDropdownMenuProps,
  SingleSelectDropdownMenuProps,
} from '.';

export interface FloatingMenuProps extends DropDownMenuProps {
  children: React.ReactNode | React.ReactNode[];
  placement?: Placement;
}

export const FloatingMenu: React.FC<
  FloatingMenuProps &
    (SingleSelectDropdownMenuProps | MultiSelectDropdownMenuProps)
> = ({ children, placement, ...props }) => {
  const { refs, floatingStyles, context } = useFloating({
    open: props.isOpen,
    onOpenChange: props.setIsOpen,
    placement,
    middleware: [flip({ fallbackAxisSideDirection: 'end' }), shift()],
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
      {props.isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <span
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 20, width: 'inherit' }}
            {...getFloatingProps()}
          >
            <DropdownMenu {...props} />
          </span>
        </FloatingFocusManager>
      )}
    </>
  );
};

FloatingMenu.defaultProps = {
  placement: undefined,
};
