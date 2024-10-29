import {
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
} from '@cypherock/cysync-ui';
import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  footerComponent?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  footerComponent,
}) => (
  <DialogBox width={800} direction="column">
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
};
