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
          <ArrowUp onClick={toggleListVisibility} />
        ) : (
          <ArrowDown onClick={toggleListVisibility} />
        )}
      </SettingsStandardItem>
      {isListVisible && (
        <div>
          <SettingsStandardItem
            title={{
              text: 'I have lost my X1 Vault but I still have all of the 4 old X1 Cards',
            }}
            description={{
              text: 'Use this flow if you have bought a completely new device only',
            }}
          >
            <Button onClick={handleWalletTransferCase1}>Select</Button>
          </SettingsStandardItem>
          <div style={{ marginTop: '20px' }}>
            <SettingsStandardItem
              title={{
                text: 'I have lost my X1 Vault and have less than 4 old X1 Cards',
              }}
              description={{
                text: 'Use this flow if you have bought a complete new Cypherock X1 and want to transfer from your old Cypherock X1',
              }}
            >
              <Button onClick={handleWalletTransferCase2}>Select</Button>
            </SettingsStandardItem>
          </div>
          <div style={{ marginTop: '20px' }}>
            <SettingsStandardItem
              title={{
                text: 'I have my old X1 Vault and have less then 4 old X1 Cards',
              }}
              description={{
                text: 'Use this flow if you have bought a completely new set of cards only',
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
