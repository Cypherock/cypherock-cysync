import React, { forwardRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
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

export interface IFilterDataType {
  text: string;
  id: string;
}

interface SelectFilterSheetProps {
  title: string;
  data: IFilterDataType[];
  onHide: () => void;
  onSelect: (id: string) => void;
  onReset: () => void;
}

export const SelectFilterSheet = forwardRef(
  (
    { onHide, data, title, onSelect }: SelectFilterSheetProps,
    ref: React.ForwardedRef<BottomSheetModal<any>> | undefined,
  ) => {
    return (
      <CyBottomSheetModal ref={ref}>
        <CyBottomSheetView style={{ paddingBottom: 20 }}>
          <Flex
            justifyContent="space-between"
            style={{ paddingVertical: 16, paddingHorizontal: 8 }}
          >
            <Typography type="h4">{title}</Typography>
            <Feather
              name="x"
              size={14}
              color={colors.text.secondary}
              onPress={() => {
                onHide();
              }}
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
              renderItem={({ item }: { item: IFilterDataType }) => (
                <InteractiveItem
                  text={item.text}
                  onPress={() => {
                    onSelect(item.id);
                    onHide();
                  }}
                />
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
