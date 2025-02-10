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
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import {
  CoinAllocationRow,
  useAssetAllocations,
  usePortfolioFilters,
} from '@/hooks';

export default function Portfolio() {
  const { strings } = useAppSelector(selectLanguage);
  const [graphData] = useState();
  const { coinAllocations, onSort, sortedBy, isAscending } =
    useAssetAllocations();
  const {
    filters,
    selectedFilter,
    filterRef,
    onFilterSelect,
    onHideFilter,
    selectedRange,
    onShowFilter,
  } = usePortfolioFilters();

  if (!graphData && !coinAllocations) {
    return (
      <NoDataScreen
        title={strings.portfolio.noAccount.title}
        description={strings.portfolio.noAccount.subTitle}
        onAction={() => router.push('/scan')}
        actionText={strings.buttons.scanQrCode}
      />
    );
  }

  return (
    <ScreenContainer>
      <Banner
        img={Images.other.banner_default}
        onPress={() => console.log('Banner Pressed')}
        title={strings.banner.title}
        subtitle={strings.banner.description}
      />
      <Container style={{ paddingHorizontal: 12, gap: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Flex gap={4} style={{ flex: 1 }}>
            <FilterButton
              placeholder="All wallets"
              onPress={() => onShowFilter('wallets')}
            />
          </Flex>
          <Flex gap={4} style={{ flex: 1 }}>
            <FilterButton
              value={strings.graph.timeRange[selectedRange]}
              placeholder="1W"
              onPress={() => onShowFilter('time')}
            />
          </Flex>
        </View>
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
        <Graph areaChart data={graphData} maxValue={30} stepValue={10} />
      </Container>

      <Table>
        <TableHeader style={{ backgroundColor: colors.background.input }}>
          {Object.values(strings.portfolio.dashboard.table).map((v: string) => (
            <TableHeaderData
              key={v}
              data={v}
              ascending={sortedBy === v && isAscending}
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
            <TableRowData
              index={index}
              onPress={() => {
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

      {filters && selectedFilter && (
        <SelectFilterSheet
          ref={filterRef}
          title={'Select Wallet'}
          onSelect={onFilterSelect}
          data={filters}
          onHide={onHideFilter}
        />
      )}
    </ScreenContainer>
  );
}
