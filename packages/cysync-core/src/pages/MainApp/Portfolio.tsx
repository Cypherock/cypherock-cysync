import React, { FC } from 'react';

import { Topbar } from '~/components';
import { AssetAllocation } from '~/pages/MainApp/Components/AssetAllocation';

export const Portfolio: FC = () => (
  <>
    <Topbar />
    <AssetAllocation />
  </>
);
