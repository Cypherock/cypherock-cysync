import {
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  WidthProps,
} from '@cypherock/cysync-ui';
import React from 'react';

export interface LayoutProps {
  width?: WidthProps['width'];
  children: React.ReactNode;
  footerComponent?: React.ReactNode;
  onClose?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  width,
  children,
  footerComponent,
  onClose,
}) => (
  <DialogBox width={width ?? 800} direction="column">
    {onClose && (
      <DialogBoxHeader justify="flex-end" py={2} px={3}>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
    )}
    <DialogBoxBody gap={32} direction="column" align="center" px={5} py={4}>
      {children}
    </DialogBoxBody>
    {footerComponent && (
      <DialogBoxFooter px={5} py={4}>
        {footerComponent}
      </DialogBoxFooter>
    )}
  </DialogBox>
);

Layout.defaultProps = {
  footerComponent: undefined,
  width: undefined,
  onClose: undefined,
};
