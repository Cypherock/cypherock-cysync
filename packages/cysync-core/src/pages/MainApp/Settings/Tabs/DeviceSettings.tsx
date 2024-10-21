import { Button, LangDisplay, ArrowDown, ArrowUp } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import {
  openAuthenticateX1CardDialog,
  openAuthenticateX1VaultDialog,
  openWalletTransferFlowDialog,
  openWalletTransferFlowLostVaultDialog,
  openWalletTransferLostCardsFlowDialog,
} from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { SettingsButton, SettingsStandardItem } from '../components';

export const DeviceSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.device;
  const dispatch = useAppDispatch();
  const [isTransferWalletListVIsible, setisTransferWalletListVIsible] =
    useState(false);

  // Function to toggle the list visibility
  const toggleListVisibility = () => {
    setisTransferWalletListVIsible(!isTransferWalletListVIsible);
  };

  const handleWalletTransferLostVault = () => {
    dispatch(openWalletTransferFlowDialog('walletTransfer'));
  };

  const handleWalletTransferLostCards = () => {
    dispatch(openWalletTransferLostCardsFlowDialog('walletTransferLostCards'));
  };

  const handleWalletTransferOldVault = () => {
    dispatch(openWalletTransferFlowLostVaultDialog('walletTransferLostVault'));
  };

  return (
    <>
      <SettingsStandardItem
        title={{ text: item.x1VaultAuth.title }}
        description={{ text: item.x1VaultAuth.description }}
      >
        <SettingsButton
          onClick={() => dispatch(openAuthenticateX1VaultDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.authenticate} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.x1CardAuth.title }}
        description={{ text: item.x1CardAuth.description }}
      >
        <SettingsButton
          variant="primary"
          onClick={() => dispatch(openAuthenticateX1CardDialog())}
        >
          <LangDisplay text={strings.buttons.authenticate} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.transferWallet.title }}
        description={{ text: item.transferWallet.description }}
      >
        {isTransferWalletListVIsible ? (
          <ArrowUp onClick={toggleListVisibility} $cursor="pointer" />
        ) : (
          <ArrowDown onClick={toggleListVisibility} $cursor="pointer" />
        )}
      </SettingsStandardItem>
      {isTransferWalletListVIsible && (
        <div>
          <SettingsStandardItem
            title={{ text: item.transferWalletSettings.lostVault.title }}
            description={{
              text: item.transferWalletSettings.lostVault.description,
            }}
          >
            <Button onClick={handleWalletTransferLostVault}>Select</Button>
          </SettingsStandardItem>
          <div style={{ marginTop: '20px' }}>
            <SettingsStandardItem
              title={{
                text: item.transferWalletSettings.lostCards.title,
              }}
              description={{
                text: item.transferWalletSettings.lostCards.description,
              }}
            >
              <Button onClick={handleWalletTransferLostCards}>Select</Button>
            </SettingsStandardItem>
          </div>
          <div style={{ marginTop: '20px' }}>
            <SettingsStandardItem
              title={{
                text: item.transferWalletSettings.oldVault.title,
              }}
              description={{
                text: item.transferWalletSettings.oldVault.description,
              }}
            >
              <Button onClick={handleWalletTransferOldVault}>Select</Button>
            </SettingsStandardItem>
          </div>
        </div>
      )}
    </>
  );
};
