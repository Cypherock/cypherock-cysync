import { SnackBarProps } from '@cypherock/cysync-ui';

export interface ISnackBarState extends SnackBarProps {
  isOpen: boolean;
  timeoutId?: NodeJS.Timeout;
}
