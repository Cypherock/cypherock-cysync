import React, { useMemo } from 'react';
import { styled } from 'styled-components';

import {
  TableHeader,
  TableHeaderComponent,
  TableHeaderComponentProps,
} from '../TableStyles';

export type SwapTableHeaderName =
  | 'time'
  | 'provider'
  | 'assetFrom'
  | 'assetTo'
  | 'received'
  | 'sent';

export interface SwapTableHeaderProps {
  time: string;
  assetFrom: string;
  assetTo: string;
  received: string;
  sent: string;
  onSort: (key: SwapTableHeaderName) => void;
  selected: SwapTableHeaderName;
  $ascending: boolean;
}

const TimeHeader = styled(TableHeader)`
  padding: 16px 16px 16px 40px;
  width: 32%;

  @media ${({ theme }) => theme.screens.lg} {
    width: 24%;
    padding: 16px 16px 16px 40px;
  }
`;

const AssetFromHeader = styled(TableHeader)`
  padding: 16px;

  width: 32%;
  @media ${({ theme }) => theme.screens.lg} {
    width: 24%;
  }
`;

const AssetToHeader = styled(TableHeader)`
  padding: 16px;

  width: 32%;
  @media ${({ theme }) => theme.screens.lg} {
    width: 24%;
  }
`;

const ReceivedHeader = styled(TableHeader)`
  padding: 16px;
  width: 20%;
`;

const SentHeader = styled(TableHeader)`
  padding: 16px;
  width: 20%;
`;

export const SwapTableHeader: React.FC<SwapTableHeaderProps> = ({
  time,
  assetFrom,
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
        name: 'time',
        Wrapper: TimeHeader as any,
        isSortable: true,
        text: time,
      },
      {
        name: 'assetFrom',
        Wrapper: AssetFromHeader as any,
        isSortable: true,
        text: assetFrom,
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
    [time, assetFrom, assetTo, received, sent],
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
