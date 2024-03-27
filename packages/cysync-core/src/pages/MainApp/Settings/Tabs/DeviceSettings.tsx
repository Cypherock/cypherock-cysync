import { Button, LangDisplay, ArrowDown, ArrowUp } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import {
  openAuthenticateX1CardDialog,
  openAuthenticateX1VaultDialog,
  openTransferFlowDialog,
  openTransferFlowLostVaultDialog,
  openTransferLessCardsFlowDialog,
} from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { SettingsButton, SettingsStandardItem } from '../components';

export const DeviceSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.device;
  const dispatch = useAppDispatch();
  const [isListVisible, setIsListVisible] = useState(false);

  // Function to toggle the list visibility
  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const handleWalletTransferCase1 = () => {
    dispatch(openTransferFlowLostVaultDialog('walletTransferLostVault'));
  };

  const handleWalletTransferCase2 = () => {
    dispatch(openTransferLessCardsFlowDialog('walletTransferLessCards'));
  };

  const handleWalletTransferCase3 = () => {
    dispatch(openTransferFlowDialog('walletTransfer'));
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
        {isListVisible ? (
          <ArrowUp onClick={toggleListVisibility} $cursor="pointer" />
        ) : (
          <ArrowDown onClick={toggleListVisibility} $cursor="pointer" />
        )}
      </SettingsStandardItem>
      {isListVisible && (
        <div>
          <SettingsStandardItem
            title={{ text: item.transferWalletSettings.case1.title }}
            description={{
              text: item.transferWalletSettings.case1.description,
            }}
          >
            <Button onClick={handleWalletTransferCase1}>Select</Button>
          </SettingsStandardItem>
          <div style={{ marginTop: '20px' }}>
            <SettingsStandardItem
              title={{
                text: item.transferWalletSettings.case2.title,
              }}
              description={{
                text: item.transferWalletSettings.case2.description,
              }}
            >
              <Button onClick={handleWalletTransferCase2}>Select</Button>
            </SettingsStandardItem>
          </div>
          <div style={{ marginTop: '20px' }}>
            <SettingsStandardItem
              title={{
                text: item.transferWalletSettings.case3.title,
              }}
              description={{
                text: item.transferWalletSettings.case3.description,
              }}
            >
              <Button onClick={handleWalletTransferCase3}>Select</Button>
            </SettingsStandardItem>
          </div>
        </div>
      )}
    </>
  );
};
