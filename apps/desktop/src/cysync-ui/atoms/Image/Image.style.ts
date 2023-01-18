import styled from "styled-components";
import { margin, MarginProps } from "../../util";

export type ImageProps = {
  src?: any;
} & MarginProps;

export const ImageStyle = styled.img`
  ${margin}
`;
