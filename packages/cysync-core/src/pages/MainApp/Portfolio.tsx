import {
  NoAccountWrapper,
  SkeletonLoader,
  GraphGreyIcon,
  Container,
  DisplayGraph,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { AssetAllocation, MainAppLayout } from '~/pages/MainApp/Components';

import { usePortfolioPage } from './hooks';

export const Portfolio: FC = () => {
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
    summaryDetails,
    accounts,
    handleAddAccountClick,
  } = usePortfolioPage();

  /*
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(openWalletActionsDialog());
  }, []);
   */

  const getMainContent = () => {
    if (accounts.length <= 0) {
      return (
        <NoAccountWrapper>
          <SkeletonLoader
            loader={<GraphGreyIcon />}
            text={lang.strings.portfolio.accountMissing.text}
            subText={lang.strings.portfolio.accountMissing.subText}
            $buttonOne={lang.strings.buttons.addAccount}
            onClick={handleAddAccountClick}
            $noLoaderContainer
          />
        </NoAccountWrapper>
      );
    }

    return (
      <>
        <Container $noFlex mb={2}>
          <DisplayGraph
            title={summaryDetails.totalBalance}
            subTitle={lang.strings.graph.totalBalance}
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
          />
        </Container>
        <AssetAllocation />
      </>
    );
  };

  return (
    <MainAppLayout title={lang.strings.portfolio.title}>
      <Container $noFlex m="20">
        {getMainContent()}
      </Container>
    </MainAppLayout>
  );
};
