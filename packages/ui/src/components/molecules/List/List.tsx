import React, { ReactElement } from 'react';
import {
  UnOrderedListStyle,
  ListItemStyle,
  OrderedListStyle,
  ListProps,
} from './List.styled';

export const UnOrderedList = ({
  children,
  ...props
}: ListProps): ReactElement => (
  <UnOrderedListStyle {...props}>{children}</UnOrderedListStyle>
);

export const ListItem = ({ children, ...props }: ListProps): ReactElement => (
  <ListItemStyle {...props}>{children}</ListItemStyle>
);

export const OrderedList = ({
  children,
  ...props
}: ListProps): ReactElement => (
  <OrderedListStyle {...props}>{children}</OrderedListStyle>
);
