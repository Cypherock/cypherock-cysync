import { ReactNode } from 'react';
import { BreakPoint } from '../themes/screens.styled';

export type MediaQuery<T> = Partial<Record<BreakPoint, T>> | T;

export type ITabs = {
  name: string;
  dialogs: {
    name: string;
    component: ReactNode;
  }[];
}[];
