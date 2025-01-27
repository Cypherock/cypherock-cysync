import styled from 'styled-components/native';
import {
  BottomSheetBackdrop,
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

export const CyBottomSheetModal = forwardRef(
  (
    props: BottomSheetModalProps,
    ref: React.ForwardedRef<BottomSheetModal<any>> | undefined,
  ) => {
    return (
      <BottomSheetModal
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop
            {...backdropProps}
            opacity={0.5}
            pressBehavior="close" // This enables the backdrop press to close the modal
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            enableTouchThrough={false}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: 'white', borderRadius: 16 }}
        containerStyle={{
          borderTopEndRadius: 16,
        }}
        {...props}
        ref={ref}
        backgroundComponent={(backgroundProps: BottomSheetBackgroundProps) => (
          <Animated.View
            pointerEvents="none"
            style={[
              { backgroundColor: colors.background.primary },
              backgroundProps.style,
            ]}
          />
        )}
      />
    );
  },
);

CyBottomSheetModal.displayName = 'CyBottomSheetModal';
