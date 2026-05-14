import { FC } from 'react';
import { StatusBar, View } from 'react-native';
import {
  Edge,
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { colors } from '../themes/color.styled';

interface ScreenContainerProps extends SafeAreaViewProps {
  backgroundColor?: string;
  type?: 'all' | 'without_top'; // based on the type it'll apply padding to the given edges
}

const edges_map: Record<NonNullable<ScreenContainerProps['type']>, Edge[]> = {
  all: ['top', 'bottom', 'left', 'right'],
  without_top: ['left', 'right'],
};

const SafeAreaViewStyled = styled(SafeAreaView)<ScreenContainerProps>`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.primary};
`;

export const ScreenContainer: FC<ScreenContainerProps> = ({
  type = 'without_top',
  ...props
}) => {
  return (
    <SafeAreaViewStyled {...props} edges={edges_map[type]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.primary}
      />
      {props.children}
    </SafeAreaViewStyled>
  );
};
