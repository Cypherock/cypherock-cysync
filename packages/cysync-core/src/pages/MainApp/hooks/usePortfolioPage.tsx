import { routes } from '~/constants';
import { useGraph, useNavigateTo } from '~/hooks';

export const usePortfolioPage = () => {
  const graphData = useGraph();
  const navigateTo = useNavigateTo();

  const onAssetClick = (parentAssetId: string, assetId: string) => {
    navigateTo(
      `${routes.asset.path}?parentAssetId=${parentAssetId}&assetId=${assetId}`,
    );
  };

  return {
    ...graphData,
    onAssetClick,
  };
};
