import { BreakPoint } from '../themes/screens.styled';

export type MediaQuery<T> = Partial<Record<BreakPoint, T>> | T;
