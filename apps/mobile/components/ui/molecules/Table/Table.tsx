import { FC } from 'react';
import styled from 'styled-components/native';
import { Loader, Typography } from '../../atoms';
import React from 'react';
import { SortIcon } from '../../icons';
import { PressableProps, TouchableOpacityProps, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { FlashList, FlashListProps } from '@shopify/flash-list';

interface TableHeaderDataProps extends TouchableOpacityProps {
  data: string;
  ascending: boolean;
  selected?: boolean;
}

interface TableDataRowProps extends PressableProps {
  index: number;
}

interface TableBodyProps<T> {
  data: T[];
  renderItem: FlashListProps<T>['renderItem'];
  separator?: FlashListProps<T>['ItemSeparatorComponent'];
  isLoading?: boolean;
}

export const Table = styled.View`
  flex: 1;
  width: 100%;
  justify-content: flex-start;
`;

export const TableHeader = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const TableRowData = styled.Pressable<TableDataRowProps>`
  width: 100%;
  flex-direction: row;
  gap: 16px;
  background: ${({ theme, index }) =>
    index % 2
      ? theme.palette.background.tableRow2
      : theme.palette.background.tableRow1};
`;

export const TableCell = styled.View`
  flex: 1;
  flex-direction: row;
  padding-horizontal: 12px;
  padding-vertical: 16px;
  justify-content: space-between;
  align-self: flex-start;
  align-items: flex-start;
`;

export const TableHeaderCell = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  padding-horizontal: 12px;
  padding-vertical: 16px;
  justify-content: space-between;
  align-self: flex-start;
  align-items: flex-start;
`;

export const TableHeaderData: FC<TableHeaderDataProps> = ({
  data,
  selected,
  ascending,
  ...props
}) => {
  return (
    <TableHeaderCell {...props}>
      <Typography type="h5" color="muted">
        {data}
      </Typography>
      <View
        style={{
          alignSelf: 'center',
        }}
      >
        {!selected ? (
          <>
            <SortIcon width={12} height={12} />
          </>
        ) : ascending ? (
          <Entypo name="triangle-up" size={16} color={'white'} />
        ) : (
          <Entypo name="triangle-down" size={16} color={'white'} />
        )}
      </View>
    </TableHeaderCell>
  );
};

export const TableBody = <T,>({
  data,
  renderItem,
  separator,
  isLoading,
  ...props
}: TableBodyProps<T> & FlashListProps<T>): JSX.Element | null => {
  if (!data) return null;
  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Loader />
      </View>
    );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={separator}
      estimatedItemSize={74}
      {...props}
    />
  );
};
