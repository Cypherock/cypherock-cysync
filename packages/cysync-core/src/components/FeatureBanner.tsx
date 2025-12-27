import { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { routes } from '~/constants';

export const FeatureBanner: FC = () => {
  const { path } = routes.portfolio;
  const location = useLocation();

  const isPortfolioPage = location.pathname.startsWith(path);

  const renderContent = useMemo(() => {
    if (!isPortfolioPage) return null;
    return null;
  }, [isPortfolioPage]);

  return renderContent;
};
