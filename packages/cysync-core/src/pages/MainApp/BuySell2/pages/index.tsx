import React from 'react';

import { BuySellHistory } from './BuySellHistory';
import { BuySellInput } from './BuySellInput';
import { BuySellReceive } from './BuySellReceive';
import { BuySellWebview } from './BuySellWebview';

export enum BuySellPage {
  Input = 0,
  Receive,
  Webview,

  History,
}

export const pageMap: Record<
  BuySellPage,
  (props: { topbarHeight: number }) => React.ReactNode
> = {
  [BuySellPage.Input]: () => <BuySellInput />,
  [BuySellPage.Receive]: () => <BuySellReceive />,
  [BuySellPage.Webview]: () => <BuySellWebview />,
  [BuySellPage.History]: ({ topbarHeight }: { topbarHeight: number }) => (
    <BuySellHistory topbarHeight={topbarHeight} />
  ),
};
