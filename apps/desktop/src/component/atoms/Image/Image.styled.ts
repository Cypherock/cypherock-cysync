import styled from "styled-components";
import { margin, MarginProps, padding, PaddingProps } from "../../util";

export interface ImageProps extends MarginProps, PaddingProps{
  src?: any;
};

export const ImageStyle = styled.img`
  ${margin}
  ${padding}
`;
