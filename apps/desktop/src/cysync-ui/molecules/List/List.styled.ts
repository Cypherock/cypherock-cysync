import {
  bgColor,
  flex,
  FlexProps,
  margin,
  MarginProps,
  width,
  BgColorProps,
  padding,
  PaddingProps,
  WidthProps,
} from "@/cysync-ui/util";
import styled from "styled-components";
import { HeadingSixStyle } from "@/cysync-ui/atoms/Headings/Heading.styled";
import { ReactNode } from "react";

export type ListProps = {
  children?: ReactNode;
  roundedListBottom?: ReactNode;
} & MarginProps &
  FlexProps &
  BgColorProps &
  PaddingProps &
  WidthProps;

export const UnOrderedListStyle = styled.ul`
  ${flex};
  ${margin};
  ${width};
  ${bgColor};
  ${padding}
  border-bottom-left-radius: ${(props: ListProps) =>
    props.roundedListBottom ? "24px" : ""};
  border-bottom-right-radius: ${(props: ListProps) =>
    props.roundedListBottom ? "24px" : ""};
`;

export const ListItemStyle = styled.li`
  ${flex};
  ${margin};
  ${width};

  font-weight: 500;
`;

export const OrderedListStyle = styled.ul`
  ${flex};
  ${margin};
  ${width};
`;
