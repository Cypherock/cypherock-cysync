import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openWalletActionsDialog } from '~/actions';
import { AssetAllocation, MainAppLayout } from '~/pages/MainApp/Components';
import { selectLanguage, useAppSelector } from '~/store';

export const Portfolio: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openWalletActionsDialog());
  }, []);

  return (
    <MainAppLayout title={strings.portfolio.title}>
      <AssetAllocation />
    </MainAppLayout>
  );
};
