import { hideAccount } from '@cypherock/coin-support-utils';
import { deleteAccount } from '@cypherock/cysync-core-services';
import {
  BlurOverlay,
  Button,
  IconDialogBox,
  Tag,
  Typography,
} from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount, IWallet } from '@cypherock/db-interfaces';
import React, { FC, useState } from 'react';

import { getDB } from '~/utils';
import logger from '~/utils/logger';

import { CoinIcon, selectLanguage, useAppSelector } from '..';

export interface DeleteAccountProps {
  account: IAccount;
  wallet?: IWallet;
  onClose: () => void;
  onAccountDeleted: () => void;
  onCancel: () => void;
}

export const DeleteAccount: FC<DeleteAccountProps> = ({
  account,
  wallet,
  onClose,
  onAccountDeleted,
  onCancel,
}) => {
  const { strings } = useAppSelector(selectLanguage);
  const [isLoading, setIsLoading] = useState(false);

  const onCancelDeleteAccountProxy = () => {
    if (isLoading) return;
    onCancel();
  };

  const onCloseProxy = () => {
    if (isLoading) return;
    onClose();
  };

  const onDeleteAccountProxy = async () => {
    logger.info('Button Click: Delete Account', {
      source: DeleteAccount.name,
    });
    setIsLoading(true);

    try {
      const db = getDB();
      if (account.type === AccountTypeMap.subAccount) {
        await hideAccount(db, account);
      } else {
        await deleteAccount(db, account);
      }
      onAccountDeleted();
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

  const isSubAccount: boolean = account.type === AccountTypeMap.subAccount;

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
          <Typography variant="h5" $textAlign="center">
            <div>
              {strings.deleteAccount.title} {textVariables.accountName}
              {textVariables.accountTag && (
                <>
                  {' '}
                  <Tag display="inline-block" $verficalAlign="middle">
                    {textVariables.accountTag}
                  </Tag>{' '}
                </>
              )}
              ?
            </div>
          </Typography>
        }
        subtext={
          isSubAccount
            ? strings.deleteAccount.tokenSubtitle
            : strings.deleteAccount.subTitle
        }
        textVariables={textVariables}
        footerComponent={
          <>
            <Button
              variant="danger"
              onClick={onDeleteAccountProxy}
              isLoading={isLoading}
            >
              {strings.deleteAccount.buttons.yes}
            </Button>

            <Button
              variant="primary"
              onClick={onCancelDeleteAccountProxy}
              disabled={isLoading}
            >
              {strings.deleteAccount.buttons.no}
            </Button>
          </>
        }
        onClose={onCloseProxy}
      />
    </BlurOverlay>
  );
};

DeleteAccount.defaultProps = {
  wallet: undefined,
};
