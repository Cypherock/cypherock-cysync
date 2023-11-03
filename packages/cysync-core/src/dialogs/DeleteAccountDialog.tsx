import { deleteAccount } from '@cypherock/cysync-core-services';
import { BlurOverlay, Button, IconDialogBox } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, { FC, useState } from 'react';

import { getDB } from '~/utils';
import logger from '~/utils/logger';

import {
  closeDialog,
  useAppDispatch,
  CoinIcon,
  selectLanguage,
  useAppSelector,
} from '..';

export interface DeleteAccountDialogProps {
  account: IAccount;
  wallet?: IWallet;
}

export const DeleteAccountDialog: FC<DeleteAccountDialogProps> = ({
  account,
  wallet,
}) => {
  const dispatch = useAppDispatch();
  const { strings } = useAppSelector(selectLanguage);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    if (isLoading) return;
    dispatch(closeDialog('deleteAccount'));
  };

  const onDeleteAccount = async () => {
    setIsLoading(true);

    try {
      await deleteAccount(getDB(), account);
      onClose();
    } catch (error) {
      logger.error('Error while deleting account');
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const textVariables = {
    accountName: account.name,
    accountTag: account.derivationScheme?.toUpperCase(),
    walletName: wallet?.name,
  };

  return (
    <BlurOverlay>
      <IconDialogBox
        icon={
          <CoinIcon
            assetId={account.assetId}
            parentAssetId={account.parentAssetId}
            size={32}
          />
        }
        title={
          textVariables.accountTag
            ? strings.deleteAccount.titleWithTag
            : strings.deleteAccount.title
        }
        subtext={strings.deleteAccount.subTitle}
        textVariables={textVariables}
        footerComponent={
          <>
            <Button
              variant="danger"
              onClick={onDeleteAccount}
              isLoading={isLoading}
            >
              {strings.deleteAccount.buttons.yes}
            </Button>

            <Button variant="primary" onClick={onClose} disabled={isLoading}>
              {strings.deleteAccount.buttons.no}
            </Button>
          </>
        }
        onClose={onClose}
      />
    </BlurOverlay>
  );
};

DeleteAccountDialog.defaultProps = {
  wallet: undefined,
};
