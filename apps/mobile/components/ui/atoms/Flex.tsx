import { FlexStyle, ViewProps } from 'react-native';
import styled from 'styled-components/native';

interface FlexProps extends ViewProps {
  direction?: 'row' | 'column';
  gap?: number;
  justifyContent?: FlexStyle['justifyContent'];
  alignItems?: FlexStyle['alignItems'];
}

export const Flex = styled.View<FlexProps>`
  flex-direction: ${({ direction = 'row' }) => direction};
  gap: ${({ gap = 4 }) => gap}px;
  justify-content: ${({ justifyContent = 'flex-start' }) => justifyContent};
  align-items: ${({ alignItems = 'center' }) => alignItems};
`;
