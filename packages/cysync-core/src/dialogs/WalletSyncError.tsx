import {
  Button,
  CheckboxList,
  CheckboxListItems,
  IconDialogBox,
  Image,
  LangDisplay,
  walletErrorIcon,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useState } from 'react';

import { deleteWallets } from '~/actions';
import { closeDialog, selectWallets, useAppDispatch } from '~/store';

import { selectLanguage, useAppSelector } from '..';

export const WalletSyncError: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const { deletedWallets, deleteWalletStatus } = useAppSelector(selectWallets);
  const [deletedWalletsCopy] = useState(deletedWallets);

  const [selectedCheckboxListItems, setSelectedCheckboxListItems] =
    useState<CheckboxListItems>(
      deletedWalletsCopy.map(wallet => ({
        label: wallet.name,
        checked: true,
        id: wallet.__id,
      })),
    );

  const syncErrorType =
    deletedWalletsCopy.length > 1 ? 'deletedMany' : 'deletedOne';

  const keepAllWallets = () => {
    dispatch(closeDialog('walletSyncError'));
  };

  const deleteSelectedWallets = () => {
    if (syncErrorType === 'deletedOne') {
      dispatch(deleteWallets(deletedWalletsCopy));
      return;
    }
    const selectedWalletIds = selectedCheckboxListItems
      .filter(i => i.checked)
      .map(i => i.id);
    const selectedWallets = deletedWalletsCopy.filter(d =>
      selectedWalletIds.includes(d.__id),
    );

    dispatch(deleteWallets(selectedWallets));
  };

  useEffect(() => {
    if (deleteWalletStatus === 'succeeded') {
      dispatch(closeDialog('walletSyncError'));
    }
  }, [deleteWalletStatus]);

  return (
    <IconDialogBox
      $isModal
      title={lang.strings.walletSync[syncErrorType].title}
      subtext={
        syncErrorType === 'deletedMany'
          ? lang.strings.walletSync.deletedMany.subTitle
          : undefined
      }
      textVariables={{
        walletName:
          deletedWalletsCopy.length > 0 ? deletedWalletsCopy[0].name : '',
      }}
      icon={<Image src={walletErrorIcon} alt="walletSync" />}
      afterTextComponent={
        syncErrorType === 'deletedMany' && (
          <CheckboxList
            items={selectedCheckboxListItems}
            setSelectedItems={setSelectedCheckboxListItems}
          />
        )
      }
      footerComponent={
        <>
          <Button variant="secondary" onClick={keepAllWallets}>
            <LangDisplay
              text={
                syncErrorType === 'deletedMany'
                  ? lang.strings.walletSync.buttons.keepAll
                  : lang.strings.walletSync.buttons.keepIt
              }
            />
          </Button>
          <Button
            disabled={
              selectedCheckboxListItems.filter(({ checked }) => checked)
                .length === 0
            }
            variant="primary"
            onClick={deleteSelectedWallets}
            isLoading={deleteWalletStatus === 'loading'}
          >
            <LangDisplay text={lang.strings.walletSync.buttons.delete} />
          </Button>
        </>
      }
      onClose={keepAllWallets}
    />
  );
};
