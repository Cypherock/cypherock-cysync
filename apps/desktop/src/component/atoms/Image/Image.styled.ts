import styled from "styled-components";
import { margin, MarginProps, padding, PaddingProps, alignSelf, AlignSelfProps } from "../../util";

export interface ImageProps extends MarginProps, PaddingProps, AlignSelfProps{
  src?: any;
};

export const ImageStyle = styled.img`
  ${margin}
  ${padding}
  ${alignSelf}
`;
