import styled from "styled-components";
import { margin, MarginProps, padding, PaddingProps } from "../../util";

export type ImageProps = {
  src?: any;
} & MarginProps &
  PaddingProps;

export const ImageStyle = styled.img`
  ${margin}
  ${padding}
`;
