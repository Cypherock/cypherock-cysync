import {
  UnOrderedListStyle,
  ListItemStyle,
  OrderedListStyle,
  ListProps,
} from "./List.styled";

export const UnOrderedList = ({ children, ...props }: ListProps) => {
  return (
      <UnOrderedListStyle {...props}>{children}</UnOrderedListStyle>
  );
};

export const ListItem = ({ children, ...props }: ListProps) => {
  return (
      <ListItemStyle {...props}>{children}</ListItemStyle>
  );
};

export const OrderedList = ({ children, ...props }: ListProps) => {
  return (
      <OrderedListStyle {...props}>{children}</OrderedListStyle>
  );
};
