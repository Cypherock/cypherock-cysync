import { Container, DisplayGraph, TriangleIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { AssetAllocation, MainAppLayout } from '~/pages/MainApp/Components';

import { usePortfolioPage } from './hooks';

export const Portfolio: FC = () => {
  const {
    theme,
    lang,
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    rangeList,
    selectedRange,
    setSelectedRange,
  } = usePortfolioPage();

  /*
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(openWalletActionsDialog());
  }, []);
   */

  return (
    <MainAppLayout title={lang.strings.portfolio.title}>
      <Container $noFlex m="20">
        <Container $noFlex mb={2}>
          <DisplayGraph
            title="12 BTC"
            subTitle={lang.strings.graph.totalBalance}
            dropdownItems={walletDropdownList}
            selectedDropdownItem={selectedWallet?.__id ?? 'all'}
            onDropdownChange={handleWalletChange}
            dropdownSearchText={lang.strings.graph.walletDropdown.search}
            pillButtonList={rangeList}
            selectedPill={selectedRange}
            onPillButtonChange={setSelectedRange as any}
            summaryText="2.3%"
            summarySubText="$0.321"
            summaryIcon={
              <TriangleIcon
                fill={theme.palette.success.main}
                width={15}
                height={15}
              />
            }
          />
        </Container>
        <AssetAllocation />
      </Container>
    </MainAppLayout>
  );
};
