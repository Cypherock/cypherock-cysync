import React from 'react';
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
  isMain?: boolean;
}

export default function AllocationTable(props: AllocationTableProps) {
  const { lang, coinAllocations, onSort, sortedBy, isAscending } =
    useAssetAllocations(props);
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
      <TableBody
        type="flat"
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
              props.isMain &&
                router.push(`/portfolio/coins/${item.parentAssetId}`);
            }}
          >
            <XTableCell
              leftIcon={item.assetIcon}
              primaryText={item.assetName}
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
