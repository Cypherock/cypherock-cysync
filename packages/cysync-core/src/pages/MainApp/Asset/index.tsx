import { BtcIdMap, coinList } from '@cypherock/coins';
import {
  Typography,
  Breadcrumb,
  Button,
  Container,
  DisplayGraph,
  Flex,
  ArrowSentIcon,
  ArrowReceivedIcon,
  SvgProps,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { openReceiveDialog, openSendDialog } from '~/actions';
import { AssetAllocation, CoinIcon, TransactionTable } from '~/components';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { useAppDispatch } from '~/store';

import { useAssetPage } from '../hooks';
import { MainAppLayout } from '../Layout';

const ReceiveIcon = (props: SvgProps) => (
  <ArrowReceivedIcon {...props} $width="12px" $height="12px" />
);

const SendIcon = (props: SvgProps) => (
  <ArrowSentIcon {...props} $width="12px" $height="12px" />
);

export const AssetPage: FC = () => {
  const navigateTo = useNavigateTo();
  const dispatch = useAppDispatch();

  const {
    lang,
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    rangeList,
    selectedRange,
    setSelectedRange,
    graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails,
    onAccountClick,
    selectedAsset,
    assetId,
    parentAssetId,
    onGraphSwitch,
    assetDropdownList,
    onAssetChange,
    showGraphInUSD,
  } = useAssetPage();

  return (
    <MainAppLayout
      topbar={{
        title: selectedAsset?.name ?? '',
        icon: (
          <CoinIcon
            parentAssetId={parentAssetId ?? ''}
            assetId={assetId}
            size={{ def: '24px', lg: '32px' }}
            containerSize={{ def: '32px', lg: '40px' }}
            withBackground
            withParentIconAtBottom
            subIconSize={{ def: '12px', lg: '18px' }}
          />
        ),
      }}
    >
      <Container $noFlex m="20">
        <Flex justify="space-between" my={2}>
          <Breadcrumb
            items={[
              {
                id: 'portfolio',
                text: lang.strings.portfolio.title,
                onClick: () => navigateTo(routes.portfolio.path),
              },
              {
                id: 'asset',
                dropdown: {
                  displayNode: (
                    <Container direction="row">
                      <CoinIcon
                        parentAssetId={parentAssetId ?? ''}
                        assetId={assetId}
                        withParentIconAtBottom
                        subIconSize="10px"
                        size="16px"
                      />
                      <Typography ml={1}>{selectedAsset?.name}</Typography>
                    </Container>
                  ),
                  selectedItem: `${parentAssetId}/${assetId}`,
                  setSelectedItem: onAssetChange,
                  dropdown: assetDropdownList,
                },
              },
            ]}
          />
          <Flex gap={8}>
            <Button
              variant="secondary"
              onClick={() => dispatch(openSendDialog())}
              size="sm"
              display="flex"
              justify="center"
              align="center"
              iconComponent={SendIcon}
            >
              {lang.strings.buttons.send}
            </Button>
            <Button
              variant="secondary"
              onClick={() => dispatch(openReceiveDialog())}
              size="sm"
              display="flex"
              justify="center"
              align="center"
              iconComponent={ReceiveIcon}
            >
              {lang.strings.buttons.receive}
            </Button>
          </Flex>
        </Flex>

        <Container $noFlex mb={2}>
          <DisplayGraph
            title={
              showGraphInUSD
                ? summaryDetails.totalValue
                : summaryDetails.totalBalance
            }
            subTitle={
              showGraphInUSD
                ? summaryDetails.totalBalance
                : summaryDetails.totalValue
            }
            conversionRate={summaryDetails.conversionRate}
            dropdownItems={walletDropdownList}
            selectedDropdownItem={selectedWallet?.__id ?? 'all'}
            onDropdownChange={handleWalletChange}
            dropdownSearchText={lang.strings.graph.walletDropdown.search}
            pillButtonList={rangeList}
            selectedPill={selectedRange}
            onPillButtonChange={setSelectedRange as any}
            summaryText={summaryDetails.changePercent}
            summarySubText={summaryDetails.changeValue}
            summaryIcon={summaryDetails.changeIcon}
            data={graphData}
            formatTooltipValue={formatTooltipValue}
            formatTimestamp={formatTimestamp}
            formatYAxisTick={formatYAxisTick}
            color={selectedAsset?.color ?? coinList[BtcIdMap.bitcoin].color}
            onSwitch={onGraphSwitch}
          />
        </Container>

        <Container $noFlex mb={2}>
          <AssetAllocation
            assetId={assetId}
            parentAssetId={parentAssetId}
            walletId={selectedWallet?.__id}
            onRowClick={onAccountClick}
          />
        </Container>

        <Container $noFlex mb={2}>
          <TransactionTable
            limit={10}
            walletId={selectedWallet?.__id}
            assetId={assetId}
            parentAssetId={parentAssetId}
            variant="withNoAssetColumn"
          />
        </Container>
      </Container>
    </MainAppLayout>
  );
};
