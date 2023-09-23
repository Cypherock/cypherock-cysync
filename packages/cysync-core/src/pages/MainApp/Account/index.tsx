import { BtcIdMap, coinList } from '@cypherock/coins';
import {
  Breadcrumb,
  Button,
  Container,
  DisplayGraph,
  Flex,
  ArrowSentIcon,
  ArrowReceivedIcon,
  SvgProps,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { FC } from 'react';

import { openReceiveDialog, openSendDialog } from '~/actions';
import { CoinIcon, TransactionTable } from '~/components';
import { useAppDispatch } from '~/store';

import { useAccountPage } from '../hooks';
import { MainAppLayout } from '../Layout';

const ReceiveIcon = (props: SvgProps) => (
  <ArrowReceivedIcon {...props} $width="12px" $height="12px" />
);

const SendIcon = (props: SvgProps) => (
  <ArrowSentIcon {...props} $width="12px" $height="12px" />
);

export const AccountPage: FC = () => {
  const dispatch = useAppDispatch();

  const {
    lang,
    selectedWallet,
    rangeList,
    selectedRange,
    setSelectedRange,
    graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails,
    accountId,
    selectedAccount,
    onGraphSwitch,
    breadcrumbItems,
    showGraphInUSD,
  } = useAccountPage();

  return (
    <MainAppLayout
      topbar={{
        title: selectedAccount?.name ?? '',
        icon: (
          <CoinIcon
            parentAssetId={selectedAccount?.parentAssetId ?? ''}
            assetId={selectedAccount?.assetId}
            size={{ def: '24px', lg: '32px' }}
            containerSize={{ def: '32px', lg: '40px' }}
            withBackground
            withParentIconAtBottom
            subIconSize={{ def: '12px', lg: '18px' }}
          />
        ),
        subTitle: lodash.upperCase(selectedAccount?.asset?.name ?? ''),
        tag: lodash.upperCase(selectedAccount?.derivationScheme ?? ''),
      }}
    >
      <Container $noFlex m="20">
        <Flex justify="space-between" my={2}>
          <Breadcrumb items={breadcrumbItems} />
          <Flex gap={8}>
            <Button
              variant="secondary"
              onClick={() =>
                dispatch(
                  openSendDialog({
                    accountId: selectedAccount?.__id,
                    walletId: selectedAccount?.walletId,
                  }),
                )
              }
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
              onClick={() =>
                dispatch(
                  openReceiveDialog({
                    accountId: selectedAccount?.__id,
                    walletId: selectedAccount?.walletId,
                  }),
                )
              }
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
            color={
              selectedAccount?.asset?.color ?? coinList[BtcIdMap.bitcoin].color
            }
            onSwitch={onGraphSwitch}
          />
        </Container>

        <Container $noFlex mb={2}>
          <TransactionTable
            limit={10}
            walletId={selectedWallet?.__id}
            accountId={accountId}
          />
        </Container>
      </Container>
    </MainAppLayout>
  );
};
