import { FC } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

interface ScreenContainerProps extends SafeAreaViewProps {
  backgroundColor?: string;
}

const SafeAreaView = styled.SafeAreaView<ScreenContainerProps>`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.primary};
`;

export const ScreenContainer: FC<ScreenContainerProps> = props => {
  return (
    <SafeAreaView {...props}>
      <StatusBar barStyle={'light-content'} />
      {props.children}
    </SafeAreaView>
  );
};
