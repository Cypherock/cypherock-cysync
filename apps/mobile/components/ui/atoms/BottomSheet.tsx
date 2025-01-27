import styled from 'styled-components/native';
import {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView as OgBottomSheetView,
} from '@gorhom/bottom-sheet';
import { FC, forwardRef } from 'react';
import Animated from 'react-native-reanimated';
import { colors } from '../themes/color.styled';

export const CyBottomSheetView = styled(OgBottomSheetView)`
  background: ${({ theme }) => theme.palette.background.primary};
  padding-horizontal: 8px;
  padding-top: 4px;
`;

const BottomSheetBackground: FC<BottomSheetBackgroundProps> = ({ style }) => {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ backgroundColor: colors.background.primary }, style]}
    />
  );
};

const Backdrop: FC<BottomSheetBackdropProps> = ({ style }) => {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ backgroundColor: colors.black, opacity: 0.5 }, style]}
    />
  );
};

export const CyBottomSheetModal = forwardRef(
  (
    props: BottomSheetModalProps,
    ref: React.ForwardedRef<BottomSheetModal<any>> | undefined,
  ) => {
    return (
      <BottomSheetModal
        backdropComponent={Backdrop}
        handleIndicatorStyle={{ backgroundColor: 'white', borderRadius: 16 }}
        containerStyle={{
          borderTopEndRadius: 16,
        }}
        {...props}
        ref={ref}
        backgroundComponent={BottomSheetBackground}
      />
    );
  },
);

CyBottomSheetModal.displayName = 'CyBottomSheetModal';
