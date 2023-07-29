import { DialogName, closeDialog, useAppDispatch } from '~/store';

export const useCloseDialogBox = () => {
  const dispatch = useAppDispatch();
  const closeDialogBox = (dialog: DialogName) => {
    dispatch(closeDialog(dialog));
  };
  return closeDialogBox;
};
