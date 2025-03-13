import React, { memo } from 'react';
import {
  AllocationTableHeaderKeys,
  CoinAllocationRow,
  UseAssetAllocationProps,
  useAssetAllocations,
} from '@/hooks';
import { router } from 'expo-router';
import {
  Table,
  TableHeader,
  TableHeaderData,
  TableBody,
  TableRowData,
  XTableCell,
  Container,
  Typography,
  Seperator,
} from '../ui';
import { colors } from '../ui/themes/color.styled';

export interface AllocationTableProps extends UseAssetAllocationProps {
  onItemClick?: (item: CoinAllocationRow) => void;
}

function AllocationTable(props: AllocationTableProps) {
  const {
    lang,
    coinAllocations,
    onSort,
    sortedBy,
    isAscending,
    isLoading,
    isAccountDisplay,
  } = useAssetAllocations(props);
  const strings = lang.strings;

  return (
    <Table>
      <TableHeader style={{ backgroundColor: colors.background.input }}>
        {Object.keys(strings.portfolio.dashboard.table).map(v => (
          <TableHeaderData
            key={v}
            data={
              strings.portfolio.dashboard.table[v as AllocationTableHeaderKeys]
            }
            selected={sortedBy === v}
            ascending={isAscending}
            onPress={() => onSort(v as AllocationTableHeaderKeys)}
          />
        ))}
      </TableHeader>
      {coinAllocations.length === 0 && !isLoading && (
        <Typography type="h5" color="secondary" style={{ paddingVertical: 24 }}>
          No Accounts Found!
        </Typography>
      )}
      <TableBody
        type="flat"
        isLoading={isLoading}
        data={coinAllocations}
        renderItem={({
          item,
          index,
        }: {
          item: CoinAllocationRow;
          index: number;
        }) => (
          <TableRowData
            index={index}
            onPress={() => {
              props.onItemClick && props.onItemClick(item);
            }}
          >
            <XTableCell
              leftIcon={item.assetIcon}
              primaryText={
                isAccountDisplay ? (item.accountName ?? '') : item.assetName
              }
              secondaryText={item.displayBalance}
            />
            <XTableCell
              primaryTextAlign="right"
              primaryText={item.displayPrice}
              secondaryTextAlign="right"
              secondaryText={item.displayValue}
              justifyContent="flex-end"
            />
          </TableRowData>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Container
            style={{ backgroundColor: colors.black, paddingVertical: 10 }}
          >
            <Typography type="para" color="primary">
              {title}
            </Typography>
          </Container>
        )}
        seperator={() => (
          <Seperator style={{ backgroundColor: colors.black }} />
        )}
      />
    </Table>
  );
}

export default memo(AllocationTable);
