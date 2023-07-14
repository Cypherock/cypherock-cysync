import {
  Button,
  CheckBox,
  CheckboxList,
  CheckboxListItems,
  Flex,
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
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedCheckboxListItems, setSelectedCheckboxListItems] =
    useState<CheckboxListItems>(
      deletedWallets.map(wallet => ({
        label: wallet.name,
        checked: true,
        id: wallet.__id,
      })),
    );

  const keepAllWallets = () => {
    dispatch(closeDialog('walletSyncError'));
  };

  const deleteSelectedWallets = () => {
    const selectedWalletIds = selectedCheckboxListItems
      .filter(i => i.checked)
      .map(i => i.id);
    const selectedWallets = deletedWallets.filter(d =>
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
      title={lang.strings.walletSync.freshOneCreated.title}
      subtext={lang.strings.walletSync.freshOneCreated.subTitle}
      icon={<Image src={walletErrorIcon} alt="walletSync" />}
      afterTextComponent={
        <>
          <CheckboxList
            items={selectedCheckboxListItems}
            setSelectedItems={setSelectedCheckboxListItems}
          />
          <Flex align="center" justify="center" width="full">
            <CheckBox
              checked={isChecked}
              onChange={() => setIsChecked(prevProps => !prevProps)}
              id="wallet_checkbox"
              label={lang.strings.walletSync.freshOneCreated.checkboxText}
            />
          </Flex>
        </>
      }
      footerComponent={
        <>
          <Button variant="secondary" onClick={keepAllWallets}>
            <LangDisplay text={lang.strings.walletSync.buttons.keepAll} />
          </Button>
          <Button
            variant="primary"
            onClick={deleteSelectedWallets}
            isLoading={deleteWalletStatus === 'loading'}
          >
            <LangDisplay text={lang.strings.walletSync.buttons.delete} />
          </Button>
        </>
      }
    />
  );
};
