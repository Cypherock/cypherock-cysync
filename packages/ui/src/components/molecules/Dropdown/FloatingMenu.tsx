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

import {
  DropdownMenu,
  MultiSelectDropdownMenuProps,
  SingleSelectDropdownMenuProps,
} from '.';

export interface FloatingMenuProps {
  children: React.ReactNode | React.ReactNode[];
  placement?: Placement;
  offset?: OffsetOptions;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FloatingMenu: React.FC<
  FloatingMenuProps &
    (SingleSelectDropdownMenuProps | MultiSelectDropdownMenuProps)
> = ({ children, placement, offset: offsetOptions, ...props }) => {
  const [isOpenInternal, setIsOpenInternal] = useState(false);

  const isControlled =
    props.isOpen !== undefined && props.setIsOpen !== undefined;
  const isOpen = isControlled ? props.isOpen! : isOpenInternal;
  const setIsOpen = isControlled ? props.setIsOpen! : setIsOpenInternal;

  const { refs, floatingStyles, context } = useFloating({
    open: isControlled ? props.isOpen : isOpenInternal,
    onOpenChange: isControlled ? undefined : setIsOpenInternal,
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
          {!isControlled && <FloatingOverlay style={{ zIndex: 10 }} />}
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
  placement: undefined,
  isOpen: undefined,
  setIsOpen: undefined,
  offset: undefined,
};
