import React, { useMemo } from 'react';
import { styled } from 'styled-components';

import {
  TableHeader,
  TableHeaderComponent,
  TableHeaderComponentProps,
} from '../TableStyles';

export type BuySellTableHeaderName =
  | 'provider'
  | 'assetTo'
  | 'received'
  | 'sent';

export interface BuySellTableHeaderProps {
  provider: string;
  assetTo: string;
  received: string;
  sent: string;
  onSort: (key: BuySellTableHeaderName) => void;
  selected: BuySellTableHeaderName;
  $ascending: boolean;
}

const ProviderHeader = styled(TableHeader)`
  padding: 16px 16px 16px 40px;
  width: 20%;
`;

const AssetToHeader = styled(TableHeader)`
  padding: 16px;
  width: 40%;
`;

const ReceivedHeader = styled(TableHeader)`
  padding: 16px;
  width: 20%;
`;

const SentHeader = styled(TableHeader)`
  padding: 16px;
  width: 20%;
`;

export const BuySellTableHeader: React.FC<BuySellTableHeaderProps> = ({
  provider,
  assetTo,
  received,
  sent,
  onSort,
  $ascending,
  selected,
}) => {
  const headers: TableHeaderComponentProps['headers'] = useMemo(
    () => [
      {
        name: 'provider',
        Wrapper: ProviderHeader as any,
        isSortable: true,
        text: provider,
      },
      {
        name: 'assetTo',
        Wrapper: AssetToHeader as any,
        isSortable: true,
        text: assetTo,
      },
      {
        name: 'received',
        Wrapper: ReceivedHeader as any,
        isSortable: true,
        text: received,
      },
      {
        name: 'sent',
        Wrapper: SentHeader as any,
        isSortable: true,
        text: sent,
      },
    ],
    [provider, assetTo, received, sent],
  );

  return (
    <TableHeaderComponent
      headers={headers}
      onSort={onSort as any}
      selected={selected}
      $ascending={$ascending}
    />
  );
};
