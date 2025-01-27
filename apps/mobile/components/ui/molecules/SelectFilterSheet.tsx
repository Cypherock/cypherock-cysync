import React, { forwardRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { EdgeInsets } from 'react-native-safe-area-context';
import {
  Card,
  CyBottomSheetModal,
  CyBottomSheetView,
  Flex,
  InteractiveItem,
  Seperator,
  Typography,
} from '../atoms';
import Feather from '@expo/vector-icons/Feather';
import { colors } from '../themes/color.styled';
import { FlatList } from 'react-native';

interface SelectFilterSheetProps {
  title: string;
  data: string[];
  onHide: () => void;
  onSelect?: () => void;
  insets: EdgeInsets;
}

export const SelectFilterSheet = forwardRef(
  (
    { onHide, data, title, insets, onSelect }: SelectFilterSheetProps,
    ref: React.ForwardedRef<BottomSheetModal<any>> | undefined,
  ) => {
    return (
      <CyBottomSheetModal ref={ref}>
        <CyBottomSheetView style={{ paddingBottom: insets.bottom }}>
          <Flex
            justifyContent="space-between"
            style={{ paddingVertical: 16, paddingHorizontal: 8 }}
          >
            <Typography type="h4">{title}</Typography>
            <Feather
              name="x"
              size={14}
              color={colors.text.secondary}
              onPress={onHide}
            />
          </Flex>
          <Card
            style={{
              marginHorizontal: 8,
              borderRadius: 16,
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
          >
            <FlatList
              style={{ width: '100%' }}
              data={data}
              renderItem={({ item }: { item: string }) => (
                <InteractiveItem text={item} onPress={onSelect} />
              )}
              ItemSeparatorComponent={() => <Seperator />}
            />
          </Card>
        </CyBottomSheetView>
      </CyBottomSheetModal>
    );
  },
);

SelectFilterSheet.displayName = 'SelectFilterSheet';
