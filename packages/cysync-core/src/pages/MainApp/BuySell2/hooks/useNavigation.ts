import { useState, useCallback } from 'react';

import { BuySellPage } from '../pages';

export const useNavigation = () => {
  const [currentPage, setCurrentPage] = useState(BuySellPage.Input);

  const toPage = useCallback((page: BuySellPage) => {
    setCurrentPage(page);
  }, []);

  const toNextPage = useCallback(() => {
    setCurrentPage(p => Math.min(BuySellPage.Webview, p + 1));
  }, []);

  const toPreviousPage = useCallback(() => {
    setCurrentPage(p => Math.max(BuySellPage.Input, p - 1));
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(BuySellPage.Input);
  }, []);

  return {
    currentPage,
    toNextPage,
    toPreviousPage,
    reset,
    toPage,
  };
};
