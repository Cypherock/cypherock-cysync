import { routes } from '~/constants';
import { CoinAllocationRow, useGraph, useNavigateTo } from '~/hooks';

export const usePortfolioPage = () => {
  const graphData = useGraph();
  const navigateTo = useNavigateTo();

  const onAssetClick = (row: CoinAllocationRow) => {
    const { parentAssetId, assetId } = row;

    navigateTo(
      `${routes.asset.path}?parentAssetId=${parentAssetId}&assetId=${assetId}`,
    );
  };

  return {
    ...graphData,
    onAssetClick,
  };
};
