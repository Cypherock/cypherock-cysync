import {
  Banner,
  Container,
  FilterButton,
  Flex,
  Graph,
  ScreenContainer,
  SelectFilterSheet,
  Seperator,
  Table,
  TableBody,
  TableHeader,
  TableHeaderData,
  TableRowData,
  Typography,
  XTableCell,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import { Images } from '@/constants';
import Entypo from '@expo/vector-icons/Entypo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CoinAllocationRow,
  useAssetAllocations,
} from '@/hooks/useAssetAllocation';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { CoinIcon } from '@/components/core';

export default function Coins() {
  const { id } = useLocalSearchParams() as { id: string };
  const insets = useSafeAreaInsets();
  const filterRef = useRef<BottomSheetModal | null>(null);
  const [graphData] = useState();
  const { lang, coinAllocations, onSort, sortedBy, isAscending } =
    useAssetAllocations({ parentAssetId: id as string });
  const navigation = useNavigation();

  const handleShowFilter = useCallback(() => {
    filterRef.current?.present();
  }, []);

  const handleHideFilter = useCallback(() => {
    filterRef.current?.close();
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: id });
    navigation.setOptions({
      headerLeft: () => <CoinIcon parentAssetId={id} size={14} />,
    });
  }, []);

  return (
    <ScreenContainer>
      <Banner
        img={Images.other.banner_default}
        onPress={() => console.log('Banner Pressed')}
        title={'Cypherock Cover is here!'}
        subtitle={'Click here to know more'}
      />
      {graphData && (
        <Container style={{ paddingHorizontal: 12, gap: 24 }}>
          <Flex gap={4}>
            <FilterButton
              placeholder="All wallets"
              onPress={handleShowFilter}
            />
            <FilterButton placeholder="1W" onPress={handleShowFilter} />
          </Flex>
          <Flex justifyContent="space-between">
            <Typography type="h3">$32,584</Typography>
            <Flex gap={8}>
              <Entypo name="triangle-up" size={8} color={colors.success} />
              <Typography type="h5" color={'secondary'}>
                2.3%
              </Typography>
              <Seperator type="v" />
              <Typography type="h5" color={'secondary'}>
                $00.321
              </Typography>
            </Flex>
          </Flex>
          <Graph areaChart data={data} maxValue={30} stepValue={10} />
        </Container>
      )}
      <Table>
        <TableHeader style={{ backgroundColor: colors.background.input }}>
          {Object.values(lang.strings.portfolio.dashboard.table).map(v => (
            <TableHeaderData
              key={v}
              data={v}
              ascending={sortedBy === v.toLowerCase() && isAscending}
              onPress={() => onSort(v.toLowerCase())}
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
            <TableRowData index={index} onPress={() => {}}>
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
      <SelectFilterSheet
        ref={filterRef}
        title={'Select Wallet'}
        data={['Cypherock', 'CyA1']}
        onHide={handleHideFilter}
        insets={insets}
      />
    </ScreenContainer>
  );
}
