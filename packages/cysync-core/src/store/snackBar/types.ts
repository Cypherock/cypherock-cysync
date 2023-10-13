import { SnackBarProps } from '@cypherock/cysync-ui';

export interface ISnackBarState {
  isOpen: boolean;
  snackBarId?: string;
  props?: SnackBarProps;
}
