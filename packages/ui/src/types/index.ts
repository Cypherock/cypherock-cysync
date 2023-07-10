import { ReactNode } from 'react';

import { BreakPoint } from '../themes/screens.styled';

export type MediaQuery<T> = Partial<Record<BreakPoint, T>> | T;

export type IWalletActionsTabs = {
  name: string;
  dialogs: {
    name: string;
    component: ReactNode;
  }[];
}[];
